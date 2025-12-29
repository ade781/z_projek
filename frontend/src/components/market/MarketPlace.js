import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils";

const MarketPlace = ({ role, userId }) => {
  const [listings, setListings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", price: 0 });
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchData = async () => {
    const resListings = await axios.get(`${BASE_URL}/market/listings?status=active`);
    setListings(resListings.data.data || []);
    if (role && userId) {
      const resTrx = await axios.get(
        `${BASE_URL}/market/transactions/${role}/${userId}`
      );
      setTransactions(resTrx.data.data || []);
    }
  };

  useEffect(() => {
    fetchData();
  }, [role, userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = name === "price" ? parseInt(value, 10) || 0 : value;
    setForm((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const handleCreateListing = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await axios.post(`${BASE_URL}/market/listings`, {
        seller_role: role,
        seller_id: userId,
        title: form.title,
        description: form.description,
        price: form.price,
      });
      setSuccessMsg("Listing berhasil dibuat.");
      setForm({ title: "", description: "", price: 0 });
      fetchData();
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Gagal membuat listing.");
    }
  };

  const handleBuy = async (id_listing) => {
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await axios.post(`${BASE_URL}/market/buy/${id_listing}`, {
        buyer_role: role,
        buyer_id: userId,
      });
      setSuccessMsg("Transaksi berhasil.");
      fetchData();
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Gagal membeli.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-200">Marketplace Guild</h1>
          <p className="text-amber-100/70 italic mt-2">
            Jual beli antar warga dan petualang. Pajak 5% untuk guild.
          </p>
        </div>

        {(errorMsg || successMsg) && (
          <div className="mb-6">
            {errorMsg && (
              <div className="bg-red-500/20 border border-red-400/40 text-red-100 p-3 rounded-lg">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-100 p-3 rounded-lg">
                {successMsg}
              </div>
            )}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="bg-slate-900/70 border border-amber-700 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-amber-200 mb-4">Buat Listing</h2>
            <form onSubmit={handleCreateListing} className="space-y-4">
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Nama barang/jasa"
                className="w-full px-4 py-3 bg-slate-800/70 border-b-2 border-amber-500 text-white outline-none"
                required
              />
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Deskripsi"
                rows={3}
                className="w-full px-4 py-3 bg-slate-800/70 border-b-2 border-amber-500 text-white outline-none"
              />
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-3 bg-slate-800/70 border-b-2 border-amber-500 text-white outline-none"
                required
              />
              <button
                type="submit"
                className="w-full py-3 rounded-lg font-bold bg-gradient-to-r from-amber-500 to-amber-700 text-white hover:from-amber-400 hover:to-amber-600"
              >
                Publikasikan
              </button>
            </form>
          </div>

          <div className="bg-slate-900/70 border border-amber-700 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-amber-200 mb-4">Listing Aktif</h2>
            <div className="space-y-4">
              {listings.map((listing) => (
                <div
                  key={listing.id_listing}
                  className="bg-slate-950/70 border border-amber-800 rounded-xl p-4"
                >
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <h3 className="text-lg text-amber-100 font-semibold">{listing.title}</h3>
                      <p className="text-sm text-amber-100/70 mt-1">{listing.description}</p>
                      <p className="text-xs text-amber-200/70 mt-2">
                        Harga: {listing.price} koin
                      </p>
                    </div>
                    <button
                      onClick={() => handleBuy(listing.id_listing)}
                      className="px-3 py-2 bg-emerald-500 text-slate-900 rounded-lg hover:bg-emerald-400"
                    >
                      Beli
                    </button>
                  </div>
                </div>
              ))}
              {listings.length === 0 && (
                <p className="text-amber-100/70">Belum ada listing.</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-slate-900/70 border border-amber-700 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold text-amber-200 mb-4">Riwayat Transaksi</h2>
          <div className="space-y-3">
            {transactions.map((trx) => (
              <div
                key={trx.id_transaction}
                className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-sm text-amber-100/80"
              >
                <div className="flex justify-between">
                  <span>ID {trx.id_transaction}</span>
                  <span>{trx.price} koin</span>
                </div>
                <div className="mt-1 text-xs text-amber-200/60">
                  Seller: {trx.seller_role} #{trx.seller_id} | Buyer: {trx.buyer_role} #{trx.buyer_id}
                </div>
              </div>
            ))}
            {transactions.length === 0 && (
              <p className="text-amber-100/70">Belum ada transaksi.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPlace;
