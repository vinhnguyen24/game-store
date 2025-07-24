"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { getNegotiationStatusUI } from "@/helper/common";
import { useSession } from "next-auth/react";

type Negotiation = {
  id: number;
  statusTransaction:
    | "pending"
    | "accepted"
    | "rejected"
    | "expired"
    | "cancelled"
    | "completed";
  finalPrice?: number;
  account: {
    id: number;
    title: string;
    price: number;
    thumbnail: { url: string };
  };
  negotiation_messages: {
    id: number;
    sender: { id: number };
    content?: string;
    price?: number;
    createdAt: string;
  }[];
};

export default function NegotiationsPage() {
  const [data, setData] = useState<Negotiation[]>([]);
  const [dataSeller, setDataSeller] = useState<Negotiation[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [price, setPrice] = useState<string>("");
  const [isBuyer, setIsBuyer] = useState(false);
  const [message, setMessage] = useState<string>("");
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  useEffect(() => {
    const fetchNegotiations = async () => {
      try {
        const [buyerRes, sellerRes] = await Promise.all([
          fetch("/api/negotiations/all?role=buyer"),
          fetch("/api/negotiations/all?role=seller"),
        ]);

        const buyerJson = await buyerRes.json();
        const sellerJson = await sellerRes.json();
        setData(buyerJson.data);
        setDataSeller(sellerJson.data);
        if (buyerJson.data.length > 0) {
          setSelectedId(buyerJson.data[0]?.id);
        } else {
          setSelectedId(sellerJson.data[0]?.id || null);
        }
      } catch (error) {
        console.error("Lỗi khi fetch negotiations:", error);
      }
    };
    fetchNegotiations();
  }, []);

  useEffect(() => {
    const selectedNego = data.find((n) => n.id === selectedId);
    if (selectedNego) setIsBuyer(true);
    else setIsBuyer(false);
  }, [selectedId]);

  const selectedNego = data.concat(dataSeller).find((n) => n.id === selectedId);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    const formatted = new Intl.NumberFormat("vi-VN").format(Number(raw));
    setPrice(formatted);
  };

  return (
    <div className="flex h-[calc(100vh-112px)] m-4 border rounded-xl shadow overflow-hidden text-gray-700">
      {/* Sidebar list */}
      <aside className="w-1/3 border-r overflow-y-auto bg-white">
        <h2 className="p-4 font-bold border-b bg-gray-50 text-lg">Đàm phán</h2>
        {data.concat(dataSeller).map((nego) => {
          const lastOffer = [...nego.negotiation_messages]
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
                src={`http://localhost:1340${nego.account.thumbnail.url}`}
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
                        {msg.content && (
                          <div className="text-gray-800">
                            Lời nhắn: {msg.content}
                          </div>
                        )}
                        {msg.price && (
                          <div className="font-semibold mt-1">
                            Đề nghị: {msg.price.toLocaleString()}đ
                          </div>
                        )}
                        <div className="text-[10px] text-gray-500 mt-1">
                          {new Date(msg.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </section>

            {/* Input */}
            <footer className="p-4 bg-white border-t">
              {isBuyer ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    // TODO: gửi message
                  }}
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
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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
                        onClick={() => {}}
                        className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
                      >
                        Tiếp tục thương lượng
                      </button>
                      <button
                        onClick={() => {}}
                        className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer"
                      >
                        Từ chối
                      </button>
                      <button
                        onClick={() => {}}
                        className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer"
                      >
                        Chấp nhận
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </footer>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Chọn một cuộc đàm phán để xem chi tiết
          </div>
        )}
      </main>
    </div>
  );
}
