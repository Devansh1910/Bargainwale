import { ChangeEvent, useEffect, useState } from "react";
import { GrNext, GrPrevious } from "react-icons/gr";
import { AppThunkDispatch, fetchData } from "../redux/userSlice";
import { RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { AiFillEdit } from "react-icons/ai";
import { BsTrashFill } from "react-icons/bs";
import { FaCheck, FaTimes } from "react-icons/fa";
import { API } from "../utils/API";
import axios from "axios";
import { toast } from "react-toastify";
import { OrderFormData } from "../pages/Orders";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { LuAsterisk } from "react-icons/lu";

export interface Order {
  _id: number;
  companyBargainNo: string;
  item: {
    type?: "oil" | "box" | "tin";
    category?: "box" | "tin";
    oilType?: "palmOil" | "vanaspatiOil" | "soybeanOil";
  };
  location: {
    state?: string;
    city?: string;
  };
  companyBargainDate: string;
  staticPrice: number;
  quantity: number;
  weightInMetrics: number;
  status?: "created" | "billed" | "payment pending" | "completed" | undefined;
}

const OrdersTable = () => {
  const [productList, setProductList] = useState<Order[]>([]);
  const [rowsLimit, setRowsLimit] = useState<number>(5);
  const [rowsToShow, setRowsToShow] = useState<Order[]>([]);
  const [customPagination, setCustomPagination] = useState<number[]>([]);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [tempStatus, setTempStatus] = useState<string | undefined>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [selectedOrder, setSelectedOrder] = useState<
    OrderFormData | undefined
  >();

  const [formData, setFormData] = useState<OrderFormData>({
    companyBargainDate: "",
    item: {
      type: "oil",
    },
    companyBargainNo: "",
    location: {
      state: "",
      city: "",
    },
    staticPrice: 0,
    quantity: 0,
    weightInMetrics: 0,

    status: "created",
    description: "",
    createdAt: new Date(),
    billedAt: undefined,
    organization: "66ad2166736b9916dd42c23a",
  });

  const data = useSelector((state: RootState) => state.userData);
  const dispatch: AppThunkDispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchData({ id: "66ad2166736b9916dd42c23a" }));
  }, [dispatch]);

  useEffect(() => {
    if (data && data.data && data.data.orders) {
      setProductList(data.data.orders);
    }
  }, [data]);

  useEffect(() => {
    if (productList.length > 0) {
      const newTotalPage = Math.ceil(productList.length / rowsLimit);
      setTotalPage(newTotalPage);
      setCustomPagination(Array.from({ length: newTotalPage }, (_, i) => i));
      setRowsToShow(productList.slice(0, rowsLimit));
    }
  }, [productList, rowsLimit]);

  const nextPage = () => {
    if (currentPage < totalPage - 1) {
      const newPage = currentPage + 1;
      const startIndex = newPage * rowsLimit;
      setRowsToShow(productList.slice(startIndex, startIndex + rowsLimit));
      setCurrentPage(newPage);
    }
  };

  const previousPage = () => {
    if (currentPage > 0) {
      const newPage = currentPage - 1;
      const startIndex = newPage * rowsLimit;
      setRowsToShow(productList.slice(startIndex, startIndex + rowsLimit));
      setCurrentPage(newPage);
    }
  };

  const changePage = (value: number) => {
    const startIndex = value * rowsLimit;
    setRowsToShow(productList.slice(startIndex, startIndex + rowsLimit));
    setCurrentPage(value);
  };

  const handleRowsLimitChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newRowsLimit = parseInt(e.target.value);
    setRowsLimit(newRowsLimit);
  };

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setTempStatus(e.target.value);
  };

  const saveStatus = (id: number) => {
    let data = JSON.stringify({
      status: tempStatus,
    });

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${API}/order/${id}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        dispatch(fetchData({ id: "66ad2166736b9916dd42c23a" }));
        toast.success("Status Updated");
      })
      .catch((error) => {
        console.log(error);
      });
    setEditingRowId(null);
  };

  const cancelEdit = () => {
    setEditingRowId(null);
    setTempStatus("");
  };

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  };

  useEffect(() => {
    const formatDate = (date?: Date): string => {
      if (!date) return "";
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };
    setFormData({
      companyBargainDate: formatDate(
        new Date(selectedOrder?.companyBargainDate || "")
      ),
      item: {
        type: selectedOrder?.item.type,
      },
      companyBargainNo: selectedOrder?.companyBargainNo,
      location: {
        state: selectedOrder?.location.state,
        city: selectedOrder?.location.city,
      },
      staticPrice: selectedOrder?.staticPrice,
      quantity: selectedOrder?.quantity,
      weightInMetrics: selectedOrder?.weightInMetrics,

      status: selectedOrder?.status,
      description: selectedOrder?.description,
      createdAt: selectedOrder?.createdAt,
      billedAt: selectedOrder?.billedAt,
      organization: selectedOrder?.organization,
    });
  }, [selectedOrder]);

  return (
    <>
      <div className="w-full h-fit flex items-center justify-center pb-14">
        <div className="w-full bg-white py-4">
          <div className="w-full overflow-x-scroll md:overflow-auto max-w-7xl 2xl:max-w-none mt-2">
            <table className="table-auto overflow-scroll md:overflow-auto w-full text-left font-inter">
              <thead className=" text-base text-white font-semibold w-full">
                <tr className=" bg-[#F7F9FC]">
                  <th className="py-5 px-8 text-[#64748B] sm:text-base font-bold whitespace-nowrap">
                    Bargain No.
                  </th>
                  <th className="py-5 px-8 text-[#64748B] sm:text-base font-bold whitespace-nowrap">
                    Bargain Date
                  </th>
                  <th className="py-5 px-8 text-[#64748B] sm:text-base font-bold whitespace-nowrap">
                    Price
                  </th>
                  <th className="py-5 px-8 text-[#64748B] sm:text-base font-bold whitespace-nowrap">
                    Quantity
                  </th>
                  <th className="py-5 px-8 text-[#64748B] sm:text-base font-bold whitespace-nowrap">
                    Weight
                  </th>
                  <th className="py-5 text-[#64748B] sm:text-base font-bold whitespace-nowrap">
                    Status
                  </th>
                  <th className="py-5 text-[#64748B] sm:text-base font-bold whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {rowsToShow.map((order) => (
                  <tr key={order._id}>
                    <td className="py-4 px-3 gap-2 font-semibold text-base whitespace-nowrap">
                      {order.companyBargainNo}
                    </td>
                    <td className="py-4 px-8 font-semibold text-base whitespace-nowrap">
                      {new Date(order.companyBargainDate)
                        .toLocaleDateString("en-GB")
                        .split("/")
                        .join("-")}
                    </td>
                    <td className="py-4 px-8 font-semibold text-base whitespace-nowrap">
                      {order.staticPrice}
                    </td>
                    <td className="py-4 px-8 font-semibold text-base whitespace-nowrap">
                      {order.quantity}
                    </td>
                    <td className="py-4 px-8 font-semibold text-base whitespace-nowrap">
                      {order.weightInMetrics}
                    </td>
                    <td className="py-2 font-semibold text-base whitespace-nowrap">
                      {editingRowId === order._id ? (
                        <div className="flex items-center gap-2 w-[150px]">
                          <select
                            value={tempStatus}
                            onChange={handleStatusChange}
                            className="border rounded px-2 py-1 w-[100px]"
                          >
                            <option value="created">Created</option>
                            <option value="billed">Billed</option>
                            <option value="payment pending">
                              Payment Pending
                            </option>
                            <option value="completed">Completed</option>
                          </select>
                          <FaCheck
                            className="text-green-500 cursor-pointer"
                            onClick={() => saveStatus(order._id)}
                          />
                          <FaTimes
                            className="text-red-500 cursor-pointer"
                            onClick={cancelEdit}
                          />
                        </div>
                      ) : (
                        <div className="flex flex-row w-[150px]">
                          <span
                            className={`${
                              order.status === "created" && "text-blue-700"
                            } ${
                              order.status === "billed" && "text-purple-700"
                            } ${
                              order.status === "payment pending" &&
                              "text-red-700"
                            } ${
                              order.status === "completed" && "text-green-700"
                            }`}
                          >
                            {order.status}
                          </span>
                          <AiFillEdit
                            className="text-[1.2rem] hover:cursor-pointer ml-2"
                            onClick={() => {
                              setEditingRowId(order._id);
                              setTempStatus(order.status);
                            }}
                          />
                        </div>
                      )}
                    </td>
                    <td className="py-4 flex flex-row gap-2 font-semibold text-base whitespace-nowrap">
                      {order.status === "created" && (
                        <AiFillEdit
                          className="text-[1.2rem] hover:cursor-pointer ml-2"
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsOpen(true);
                          }}
                        />
                      )}
                      <BsTrashFill className="text-[1.2rem] text-red-500 hover:cursor-pointer" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="w-full flex justify-center sm:justify-between flex-col sm:flex-row gap-5 mt-1.5 px-1 items-center">
            <div className="flex items-center gap-2">
              <label htmlFor="rowsPerPage" className="text-md font-semibold">
                Show Rows:
              </label>
              <select
                id="rowsPerPage"
                value={rowsLimit}
                onChange={handleRowsLimitChange}
                className="border rounded px-4 ml-4 rounded-xl py-2 border-[#E2E8F0]"
              >
                <option value={5}>5 items</option>
                <option value={10}>10 items</option>
                <option value={15}>15 items</option>
                <option value={20}>20 items</option>
              </select>
            </div>
            <div className="flex">
              <ul
                className="flex justify-center items-center gap-x-[10px] z-30"
                role="navigation"
                aria-label="Pagination"
              >
                <li
                  className={`prev-btn flex items-center justify-center w-[36px] rounded-[6px] h-[36px] border-[1px] border-solid border-[#E2E8F0] ${
                    currentPage === 0
                      ? "bg-[#cccccc] pointer-events-none"
                      : "cursor-pointer"
                  }`}
                  onClick={previousPage}
                >
                  <GrPrevious className="text-[#94A3B8]" />
                </li>
                {customPagination.map((index) => (
                  <li
                    className={`flex items-center justify-center w-[36px] rounded-[6px] h-[34px] border-[1px] border-solid border-[2px] bg-[#FFFFFF] cursor-pointer ${
                      currentPage === index
                        ? "text-white bg-black border-[#E2E8F0]"
                        : "border-[#E4E4EB]"
                    }`}
                    onClick={() => changePage(index)}
                    key={index}
                  >
                    {index + 1}
                  </li>
                ))}
                <li
                  className={`flex sm:mr-4 lg:mr-10 items-center justify-center w-[36px] rounded-[6px] h-[36px] border-[1px] border-solid border-[#E4E4EB] ${
                    currentPage === totalPage - 1
                      ? "bg-[#cccccc] pointer-events-none"
                      : "cursor-pointer"
                  }`}
                  onClick={nextPage}
                >
                  <GrNext className="text-[#94A3B8]" />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Edit order form */}
      {isOpen && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-gray-900 bg-opacity-50`}
        >
          <div
            className={`p-4 w-full sm:w-fit overflow-y-auto hideScroller h-full`}
          >
            <div className="w-full relative bg-white rounded-lg shadow">
              <div className="flex flex-row items-center justify-between gap-8 border-b-2 px-10 py-4">
                <div className="flex flex-col">
                  <h1 className="text-[1.5rem] font-[500]">Edit Order</h1>
                </div>
                <IoIosCloseCircleOutline
                  onClick={() => setIsOpen(false)}
                  className="text-[1.7rem] hover:cursor-pointer"
                />
              </div>
              <div className="flex flex-col mt-2 px-8 pb-5">
                <form
                  // onSubmit={handleSubmit}
                  className="flex flex-col gap-2 justify-center"
                >
                  <div className="flex flex-col gap-1">
                    <label className="flex flex-row mt-2 items-center text-[#0F172A] text-[1.2rem] font-Roboto">
                      Company Bargain Date
                      <LuAsterisk className="text-sm text-[#C62828]" />
                    </label>
                    <input
                      type="date"
                      className="w-full py-2 px-4 mt-2 focus:outline-none border-2 border-[#00000033] rounded-[8px] text-[1.1rem]"
                      name="companyBargainDate"
                      value={formData.companyBargainDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex flex-col gap-1 mt-2">
                    <label className="flex flex-row items-center text-[#0F172A] text-[1.2rem] font-Roboto">
                      Company Bargain No
                      <LuAsterisk className="text-sm text-[#C62828]" />
                    </label>
                    <input
                      type="text"
                      className="w-full py-2 px-4 mt-2 focus:outline-none border-2 border-[#00000033] rounded-[8px] text-[1.1rem]"
                      placeholder="Enter company bargain number"
                      name="companyBargainNo"
                      value={formData.companyBargainNo}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex flex-row gap-4 mt-2">
                    <div className="flex flex-col gap-1 w-1/2">
                      <label className="flex flex-row items-center text-[#0F172A] text-[1.2rem] font-Roboto">
                        State
                        <LuAsterisk className="text-sm text-[#C62828]" />
                      </label>
                      <input
                        type="text"
                        className="w-full py-2 px-4 mt-2 focus:outline-none border-2 border-[#00000033] rounded-[8px] text-[1.1rem]"
                        placeholder="State"
                        name="locationState"
                        value={formData.location.state}
                        onChange={(e) =>
                          setFormData((prevData) => ({
                            ...prevData,
                            location: {
                              ...prevData.location,
                              state: e.target.value,
                            },
                          }))
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-1 w-1/2">
                      <label className="flex flex-row items-center text-[#0F172A] text-[1.2rem] font-Roboto">
                        City
                        <LuAsterisk className="text-sm text-[#C62828]" />
                      </label>
                      <input
                        type="text"
                        className="w-full py-2 px-4 mt-2 focus:outline-none border-2 border-[#00000033] rounded-[8px] text-[1.1rem]"
                        placeholder="City"
                        name="locationCity"
                        value={formData.location.city}
                        onChange={(e) =>
                          setFormData((prevData) => ({
                            ...prevData,
                            location: {
                              ...prevData.location,
                              city: e.target.value,
                            },
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="flex flex-row gap-4 mt-2">
                    <div className="flex flex-col gap-1 w-1/2">
                      <label className="flex flex-row items-center text-[#0F172A] text-[1.2rem] font-Roboto">
                        Static Price
                        <LuAsterisk className="text-sm text-[#C62828]" />
                      </label>
                      <input
                        type="number"
                        className="w-full py-2 px-4 mt-2 focus:outline-none border-2 border-[#00000033] rounded-[8px] text-[1.1rem]"
                        placeholder="Enter static price"
                        name="staticPrice"
                        value={formData.staticPrice}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="flex flex-col gap-1 w-1/2">
                      <label className="flex flex-row items-center text-[#0F172A] text-[1.2rem] font-Roboto">
                        Quantity
                        <LuAsterisk className="text-sm text-[#C62828]" />
                      </label>
                      <input
                        type="number"
                        className="w-full py-2 px-4 mt-2 focus:outline-none border-2 border-[#00000033] rounded-[8px] text-[1.1rem]"
                        placeholder="Enter quantity"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="flex flex-row gap-4 mt-2">
                    <div className="flex flex-col gap-1 w-full">
                      <label className="flex flex-row items-center text-[#0F172A] text-[1.2rem] font-Roboto">
                        Weight in Metrics
                        <LuAsterisk className="text-sm text-[#C62828]" />
                      </label>
                      <input
                        type="number"
                        className="w-full py-2 px-4 mt-2 focus:outline-none border-2 border-[#00000033] rounded-[8px] text-[1.1rem]"
                        placeholder="Enter weight in metrics"
                        name="weightInMetrics"
                        value={formData.weightInMetrics}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 mt-2">
                    <label className="flex flex-row items-center text-[#0F172A] text-[1.2rem] font-Roboto">
                      Status
                      <LuAsterisk className="text-sm text-[#C62828]" />
                    </label>
                    <select
                      className="w-full py-2 px-4 mt-2 focus:outline-none border-2 border-[#00000033] rounded-[8px] text-[1.1rem]"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="created">Created</option>
                      <option value="billed">Billed</option>
                      <option value="payment pending">Payment Pending</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1 mt-2">
                    <label className="flex flex-row items-center text-[#0F172A] text-[1.2rem] font-Roboto">
                      Description
                    </label>
                    <textarea
                      className="w-full py-2 px-4 mt-2 focus:outline-none border-2 border-[#00000033] rounded-[8px] text-[1.1rem]"
                      placeholder="Enter description"
                      name="description"
                      value={formData.description || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex flex-row gap-5 mt-3">
                    <button
                      className="w-[50%] text-[1.1rem] rounded-[8px] border-2 font-bold text-richblack-900 px-[0.8rem] py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </button>
                    <button className="w-[50%] bg-black text-[1.1rem] rounded-[8px] text-white font-bold text-richblack-900 px-[0.8rem] py-2 hover:bg-black/80">
                      {/* Uncomment and use loading state if needed */}
                      {/* {loading ? (
                                    <div className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                                ) : ( */}
                      <span>Submit</span>
                      {/* )} */}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrdersTable;
