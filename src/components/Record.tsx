import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Select, Space, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../store";
import { getCategories } from "../store/actions/categoryActions";
import {
  addRecord,
  deleteRecord,
  getRecords,
  updateRecord,
} from "../store/actions/recordActions";
import { Category } from "../types/category";
import { Mode } from "../types/common";
import { RecordForm, Records } from "../types/records";

function Record() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [mode, setMode] = useState<Mode>("new");
  const [updateId, setUpdateId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const dispatch = useDispatch();

  const emptyRecordForm: RecordForm = {
    title: "",
    amount: 0,
    category_id: 0,
  };

  const [form, setForm] = useState<RecordForm>(emptyRecordForm);

  const isFormValid = !(
    !form.title ||
    form.amount === 0 ||
    form.category_id === 0
  );

  const { data, loading, error } = useSelector(
    (state: AppState) => state.records
  );

  const { data: categories } = useSelector(
    (state: AppState) => state.categories
  );

  var formatter = new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
  });

  const showModal = (mode: Mode) => {
    setIsModalVisible(true);
    setMode(mode);
  };

  const handleOk = () => {
    console.log(form);

    if (mode === "new") dispatch(addRecord(form));
    else if (mode === "edit" && typeof updateId === "number")
      dispatch(updateRecord(form, updateId));
    else if (mode === "delete" && typeof deleteId === "number")
      dispatch(deleteRecord(deleteId));

    setIsModalVisible(false);
    setMode("new");
    setForm(emptyRecordForm);
    setUpdateId(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setMode("new");
    setForm(emptyRecordForm);
    setUpdateId(null);
    setDeleteId(null);
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: Records["amount"], record: Records) => {
        return <>{formatter.format(amount)}</>;
      },
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category: Category, record: Records) => {
        return (
          <>
            <Tag color={category.color}>{category.name.toUpperCase()}</Tag>
          </>
        );
      },
    },
    {
      title: "Last Update",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (updatedAt: string, record: Records) => {
        const updatedAtObj = new Date(updatedAt);
        return (
          <>
            <>{updatedAtObj.toLocaleDateString()} </>
            <>
              {" "}
              {updatedAtObj.toLocaleTimeString("tr-TR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </>
          </>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (text: string, records: Records) => {
        const { title, amount } = records;
        const category_id = records.category.id;
        return (
          <Space size="middle">
            <EditOutlined
              style={{ color: "#0390FC", cursor: "pointer" }}
              onClick={() => {
                showModal("edit");
                setForm({ title, amount, category_id });
                setUpdateId(records.id);
              }}
            />
            <DeleteOutlined
              style={{ color: "#c20808", cursor: "pointer" }}
              onClick={() => {
                showModal("delete");
                setDeleteId(records.id);
              }}
            />
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    dispatch(getRecords());
    !categories.length && dispatch(getCategories());
  }, []);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "1rem",
        }}
      >
        <Button
          type="primary"
          onClick={() => {
            showModal("new");
          }}
        >
          New Record
        </Button>
      </div>
      <Modal
        title={
          mode === "new"
            ? "Create New Record"
            : mode === "edit"
            ? "Update Record"
            : "Delete Record"
        }
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ disabled: !isFormValid && !(mode === "delete") }}
      >
        {mode === "edit" || mode === "new" ? (
          <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
            <Form.Item label="Title" required>
              <Input
                name="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </Form.Item>
            <Form.Item label="Amount" required>
              <Input
                name="amount"
                type="number"
                value={form.amount}
                onChange={(e) =>
                  setForm({ ...form, amount: Number(e.target.value) })
                }
              />
            </Form.Item>
            <Form.Item label="Category">
              <Select
                value={form.category_id}
                defaultValue={form.category_id}
                onChange={(category_id) => setForm({ ...form, category_id })}
              >
                <Select.Option value={0} disabled hidden>
                  Select a category
                </Select.Option>
                {categories.map((category) => {
                  return (
                    <Select.Option value={category.id} key={category.id}>
                      {category.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Form>
        ) : mode === "delete" ? (
          <>Are you sure?</>
        ) : null}
      </Modal>
      <div>
        <Table
          loading={loading}
          columns={columns}
          dataSource={data}
          rowKey="id"
        />
      </div>
    </>
  );
}

export default Record;
