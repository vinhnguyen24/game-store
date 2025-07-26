"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { getNegotiationStatusUI } from "@/helper/common";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import ConfirmDialog from "@/components/ConfirmDialog";

type Negotiation = {
  id: number;
  statusTransaction:
    | "pending"
    | "accepted"
    | "rejected"
    | "expired"
    | "cancelled"
    | "completed"
    | "unavailable";
  finalPrice?: number;
  account: {
    id: number;
    title: string;
    price: number;
    documentId: string;
    thumbnail: { url: string };
  };
  documentId: string;
  negotiation_messages: {
    id: number;
    sender: { id: number };
    content?: string;
    price?: number;
    createdAt: string;
    type: string;
  }[];
  zaloGroupLink: string;
};

export default function NegotiationsPage() {
  const [data, setData] = useState<Negotiation[]>([]);
  const [dataSeller, setDataSeller] = useState<Negotiation[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [price, setPrice] = useState<string>("");
  const [isBuyer, setIsBuyer] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [isRejected, setIsRejected] = useState<boolean>(false);
  const [isAccept, setIsAccept] = useState<boolean>(false);
  const [isUnavailable, setIsUnavailable] = useState<boolean>(false);
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [onConfirmAction, setOnConfirmAction] = useState<() => void>(() => {});
  const [resetFlag, setResetFlag] = useState<number>(1);

  const confirm = (message: string, action: () => void) => {
    setConfirmMessage(message);
    setOnConfirmAction(() => action);
    setConfirmOpen(true);
  };

  const fetchNegotiations = async () => {
    try {
      const [buyerRes, sellerRes] = await Promise.all([
        fetch("/api/negotiations/all?role=buyer"),
        fetch("/api/negotiations/all?role=seller"),
      ]);

      const buyerJson = await buyerRes.json();
      const sellerJson = await sellerRes.json();
      setData(buyerJson?.data);
      setDataSeller(sellerJson?.data);

      if (buyerJson?.data?.length > 0) {
        setSelectedId(buyerJson?.data?.[0]?.id);
      } else {
        setSelectedId(sellerJson?.data?.[0]?.id || null);
      }
    } catch (error) {
      console.error("Lỗi khi fetch negotiations:", error);
    }
  };

  const fetchMessagesById = async (id: string | undefined) => {
    try {
      const res = await fetch(`/api/negotiations/${id}`);
      const updated = await res.json();
      setData((prev) =>
        prev.map((item) =>
          item.documentId === id
            ? { ...item, negotiation_messages: updated?.negotiation_messages }
            : item
        )
      );
      setDataSeller((prev) =>
        prev.map((item) =>
          item.documentId === id
            ? { ...item, negotiation_messages: updated?.negotiation_messages }
            : item
        )
      );
    } catch (err) {
      console.error("Lỗi khi lấy tin nhắn mới:", err);
    }
  };

  useEffect(() => {
    fetchNegotiations();
  }, []);

  useEffect(() => {
    const isBuyer = data.find((n) => n.id === selectedId);
    if (isBuyer) setIsBuyer(true);
    else setIsBuyer(false);
    const selectedNego = (data || [])
      .concat(dataSeller || [])
      .find((n) => n.id === selectedId);
    setIsRejected(selectedNego?.statusTransaction === "rejected");
    setIsAccept(selectedNego?.statusTransaction === "accepted");
    setIsUnavailable(selectedNego?.statusTransaction === "unavailable");
  }, [selectedId, resetFlag]);

  useEffect(() => {
    if (!selectedId) return;
    const interval = setInterval(() => {
      if (!(isRejected || isAccept || isUnavailable))
        fetchMessagesById(selectedNego?.documentId);
    }, 10000); // mỗi 10 giây
    return () => clearInterval(interval); // clear khi component unmount
  }, [selectedId, isRejected, isAccept, isUnavailable]);

  const selectedNego = (data || [])
    .concat(dataSeller || [])
    .find((n) => n.id === selectedId);
  const messages = selectedNego?.negotiation_messages || [];
  const lastOffer = messages
    .slice()
    .reverse()
    .find((msg) => typeof msg.price !== "undefined");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    const formatted = new Intl.NumberFormat("vi-VN").format(Number(raw));
    setPrice(formatted);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const parsedPrice = parseInt(price.replace(/[^0-9]/g, ""));
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return;
    }

    try {
      await fetch("/api/negotiate", {
        method: "POST",
        body: JSON.stringify({
          accountId: selectedId,
          price: parsedPrice,
          message,
        }),
      });
      toast.success(
        "Tạo thương lượng thành công, vui lòng chờ phản hồi từ người bán."
      );

      setPrice("");
      setMessage("");
      await fetchNegotiations();
    } catch (err: any) {
      console.error(err);
      toast.error("Tạo thương lượng thất bại, vui lòng thử lại sau!");
    }
  };

  const handleContinue = async () => {
    try {
      await fetch("/api/negotiate/seller-response", {
        method: "POST",
        body: JSON.stringify({
          message,
          negotiationId: selectedId,
          price: lastOffer?.price,
          type: "offer",
        }),
      });
      toast.success(
        "Thương lượng thành công, vui lòng chờ người mua phản hồi!"
      );

      setPrice("");
      setMessage("");
      await fetchNegotiations();
    } catch (err: any) {
      console.error(err);
      toast.error("Phản hồi thất bại, vui lòng thử lại sau!");
    }
  };

  const doReject = async () => {
    await fetch("/api/negotiate/seller-response", {
      method: "POST",
      body: JSON.stringify({
        accountId: selectedId,
        message,
        negotiationId: selectedId,
        negotiationDoc: selectedNego?.documentId,
        price: lastOffer?.price,
        type: "reject",
      }),
    });
    toast.success("Từ chối thương lượng.");
    setPrice("");
    setMessage("");
    await fetchNegotiations();
    setResetFlag(resetFlag + 1);
  };

  const doAccept = async () => {
    await fetch("/api/negotiate/seller-response", {
      method: "POST",
      body: JSON.stringify({
        message,
        negotiationId: selectedId,
        negotiationDoc: selectedNego?.documentId,
        price: lastOffer?.price,
        type: "accept",
        accountId: selectedNego?.account?.id,
      }),
    });
    toast.success("Chấp nhận thương lượng.");
    setPrice("");
    setMessage("");
    await fetchNegotiations();
    setResetFlag(resetFlag + 1);
  };

  return (
    <div className="flex h-[calc(100vh-112px)] m-4 border rounded-xl shadow overflow-hidden text-gray-700">
      {/* Sidebar list */}
      <aside className="w-1/3 border-r overflow-y-auto bg-white">
        <h2 className="p-4 font-bold border-b bg-gray-50 text-lg">Đàm phán</h2>
        {(data || []).concat(dataSeller || []).map((nego) => {
          const lastOffer = [...nego?.negotiation_messages]
            .reverse()
            .find((msg) => msg.price !== undefined);

          const { label, color } = getNegotiationStatusUI(
            nego.statusTransaction
          );

          return (
            <div
              key={nego.id}
              onClick={() => setSelectedId(nego.id)}
              className={clsx(
                "p-4 border-b hover:bg-gray-100 flex gap-3 cursor-pointer",
                selectedId === nego.id && "bg-blue-50"
              )}
            >
              <Image
                src={
                  nego?.account?.thumbnail?.url
                    ? `${process.env.NEXT_PUBLIC_API_BASE_URL_DOMAIN}${nego?.account?.thumbnail?.url}`
                    : "/images/default-account.jpg"
                }
                alt={nego.account.title}
                width={48}
                height={48}
                className="rounded object-cover"
              />
              <div className="flex-1 text-sm">
                <div className="font-semibold truncate">
                  {nego.account.title}
                </div>
                <div className="text-gray-500">
                  Giá gốc: {Number(nego.account.price)?.toLocaleString()}đ
                </div>
                {lastOffer && (
                  <div className="text-gray-700">
                    Giá cuối: {lastOffer.price?.toLocaleString()}đ
                  </div>
                )}
                <div className={clsx("text-xs mt-1", color)}>{label}</div>
              </div>
            </div>
          );
        })}
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col bg-gray-50">
        {selectedNego ? (
          <>
            {/* Header */}
            <header className="p-4 bg-white border-b flex justify-between items-center">
              <div>
                <div className="font-bold">{selectedNego.account.title}</div>
                <div className="text-sm text-gray-500">
                  Giá gốc:{" "}
                  {Number(selectedNego.account.price)?.toLocaleString()}đ
                </div>
              </div>
              <Link
                href={`/accounts/${selectedNego.account.id}`}
                className="text-blue-600 text-sm underline"
              >
                Xem tài khoản
              </Link>
            </header>

            {/* Messages */}
            <section className="flex-1 overflow-y-auto p-4 space-y-2">
              {[...selectedNego.negotiation_messages]
                .sort(
                  (a, b) =>
                    new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime()
                )
                .map((msg) => {
                  const isSelf = msg.sender.id === currentUserId;
                  const isSellerMessage = isBuyer
                    ? msg.sender.id !== currentUserId
                    : msg.sender.id === currentUserId;
                  return (
                    <div
                      key={msg.id}
                      className={clsx(
                        "flex w-full",
                        isSelf ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={clsx(
                          "max-w-[70%] p-3 rounded-xl text-sm",
                          isSelf
                            ? "bg-blue-100 text-right"
                            : "bg-gray-200 text-left"
                        )}
                      >
                        {msg.content ? (
                          <div className="text-gray-800">{msg.content}</div>
                        ) : (
                          <div className="text-gray-800">{msg.type}</div>
                        )}

                        {!isSellerMessage
                          ? msg.price && (
                              <div
                                className={
                                  "font-semibold mt-1 " +
                                  (msg.price === lastOffer?.price
                                    ? ""
                                    : "line-through")
                                }
                              >
                                Đề nghị: {msg.price.toLocaleString()}đ
                              </div>
                            )
                          : null}
                        <div className="text-[10px] text-gray-500 mt-1">
                          {new Date(msg.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </section>

            {/* Input */}
            {isRejected ? (
              <div className="p-4 bg-white border">Giao dịch đã bị từ chối</div>
            ) : isUnavailable ? (
              <div className="p-4 bg-white border">
                Account đang không có sẵn, hãy quay lại sau
              </div>
            ) : isAccept ? (
              <div className="p-4 bg-white border">
                Đã xác nhận giao dịch. Hãy tham gia nhóm zalo này:{" "}
                {selectedNego?.zaloGroupLink ? (
                  <Link
                    href={selectedNego?.zaloGroupLink}
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    {selectedNego?.zaloGroupLink}
                  </Link>
                ) : (
                  "Đang cập nhật..."
                )}
              </div>
            ) : (
              <footer className="p-4 bg-white border-t">
                {isBuyer ? (
                  <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-2 border-t pt-4 mt-4"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <label
                        htmlFor="offer-price"
                        className="font-medium whitespace-nowrap"
                      >
                        Giá bạn đề nghị
                      </label>
                      <input
                        id="offer-price"
                        placeholder="VD: 95000000"
                        value={price}
                        onChange={handleChange}
                        className="border p-2 rounded flex-grow"
                        required
                      />
                    </div>
                    <textarea
                      placeholder="Lời nhắn đi kèm (không bắt buộc)"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="border p-2 rounded"
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
                    >
                      Gửi đề nghị
                    </button>
                  </form>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      // TODO: gửi message
                    }}
                    className="flex flex-col gap-2 mt-4"
                  >
                    <div className="space-y-2 mt-4">
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Nhập nội dung phản hồi"
                        className="w-full border p-2 rounded"
                      />

                      <div className="flex gap-2">
                        <button
                          onClick={handleContinue}
                          className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
                        >
                          Tiếp tục thương lượng
                        </button>
                        <button
                          onClick={() =>
                            confirm(
                              "Bạn có chắc muốn từ chối thương lượng?",
                              doReject
                            )
                          }
                          className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer"
                        >
                          Từ chối
                        </button>
                        <button
                          onClick={() =>
                            confirm(
                              `Chấp nhận mức giá ${lastOffer?.price?.toLocaleString()}đ và bắt đầu giao dịch?`,
                              doAccept
                            )
                          }
                          className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer"
                        >
                          Chấp nhận
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </footer>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Chọn một cuộc đàm phán để xem chi tiết
          </div>
        )}
        <ConfirmDialog
          open={confirmOpen}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={async () => {
            try {
              await onConfirmAction();
              setConfirmOpen(false);
            } catch (err) {
              toast.error("Lỗi khi thực hiện hành động. Vui lòng thử lại.");
            }
          }}
          message={confirmMessage}
        />
      </main>
    </div>
  );
}
