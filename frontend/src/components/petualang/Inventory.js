import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils";

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("accessToken");
  const id_petualang = localStorage.getItem("id_petualang");

  const fetchData = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const [itemsRes, invRes] = await Promise.all([
        axios.get(`${BASE_URL}/inventory/items`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${BASE_URL}/inventory/${id_petualang}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setItems(itemsRes.data.data || []);
      setInventory(invRes.data.data || []);
    } catch (error) {
      setErrorMsg("Gagal memuat toko dan inventori.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token || !id_petualang) {
      setErrorMsg("Silakan login terlebih dahulu.");
      setLoading(false);
      return;
    }
    fetchData();
  }, []);

  const handleBuy = async (id_item) => {
    try {
      await axios.post(
        `${BASE_URL}/inventory/buy`,
        { id_petualang, id_item },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Gagal membeli item.");
    }
  };

  const handleActivate = async (id_item) => {
    try {
      await axios.post(
        `${BASE_URL}/inventory/activate`,
        { id_petualang, id_item },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Gagal mengaktifkan item.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-amber-900 flex items-center justify-center">
        <div className="text-amber-200">
          <div className="w-14 h-14 border-4 border-amber-300 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4">Menyiapkan gudang...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-amber-900 to-slate-950 px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-amber-200">Gudang Petualang</h1>
          <p className="text-amber-100/80 italic mt-2">
            Gunakan item untuk memperkuat perjalananmu.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-500/20 border border-red-400/40 text-red-100 p-4 rounded-xl mb-6">
            {errorMsg}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="bg-slate-900/70 border border-amber-700 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-amber-200 mb-4">Toko Guild</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id_item}
                  className="bg-slate-950/70 border border-amber-800 rounded-xl p-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-lg text-amber-100 font-semibold">{item.name}</h3>
                    <p className="text-sm text-amber-100/70">{item.description}</p>
                    <p className="text-xs text-amber-300 mt-2">
                      {item.type} · {item.price_koin} koin
                    </p>
                  </div>
                  <button
                    onClick={() => handleBuy(item.id_item)}
                    className="px-3 py-2 bg-amber-500 text-slate-900 font-semibold rounded-lg hover:bg-amber-400"
                  >
                    Beli
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/70 border border-amber-700 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-amber-200 mb-4">Inventori</h2>
            <div className="space-y-4">
              {inventory.map((inv) => (
                <div
                  key={inv.id_petualang_item}
                  className="bg-slate-950/70 border border-amber-800 rounded-xl p-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-lg text-amber-100 font-semibold">{inv.item?.name}</h3>
                    <p className="text-sm text-amber-100/70">{inv.item?.description}</p>
                    <p className="text-xs text-amber-300 mt-2">
                      Qty: {inv.quantity} · {inv.is_active ? "Aktif" : "Tidak aktif"}
                    </p>
                  </div>
                  {inv.item?.type !== "cosmetic" && (
                    <button
                      onClick={() => handleActivate(inv.item.id_item)}
                      className="px-3 py-2 bg-emerald-500 text-slate-900 font-semibold rounded-lg hover:bg-emerald-400"
                    >
                      Aktifkan
                    </button>
                  )}
                </div>
              ))}
              {inventory.length === 0 && (
                <p className="text-amber-100/70">Inventori masih kosong.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
