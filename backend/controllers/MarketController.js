import MarketListing from "../models/MarketListingModel.js";
import MarketTransaction from "../models/MarketTransactionModel.js";
import Petualang from "../models/PetualangModel.js";
import WargaDesa from "../models/WargaDesaModel.js";
import Owner from "../models/OwnerModel.js";
import db from "../config/Database.js";
import { Op } from "sequelize";

const TAX_RATE = 0.05;

const getDefaultOwner = async () => {
  const owner = await Owner.findOne({ order: [["id_owner", "ASC"]] });
  return owner;
};

const getUserByRole = async (role, id) => {
  if (role === "petualang") {
    return Petualang.findOne({ where: { id_petualang: id } });
  }
  return WargaDesa.findOne({ where: { id_warga_desa: id } });
};

export const createListing = async (req, res) => {
  try {
    const { seller_role, seller_id, title, description, price } = req.body;
    if (!seller_role || !seller_id || !title || !price) {
      return res.status(400).json({ message: "Data listing wajib lengkap." });
    }
    if (price <= 0) {
      return res.status(400).json({ message: "Harga harus lebih dari 0." });
    }

    const seller = await getUserByRole(seller_role, seller_id);
    if (!seller) {
      return res.status(404).json({ message: "Penjual tidak ditemukan." });
    }

    const listing = await MarketListing.create({
      seller_role,
      seller_id,
      title,
      description,
      price,
      status: "active",
    });

    res.status(201).json({ message: "Listing dibuat.", data: listing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getListings = async (req, res) => {
  try {
    const { status, seller_role, seller_id } = req.query;
    const where = {};
    if (status) where.status = status;
    if (seller_role) where.seller_role = seller_role;
    if (seller_id) where.seller_id = seller_id;

    const listings = await MarketListing.findAll({
      where,
      order: [["created_at", "DESC"]],
    });
    res.status(200).json({ data: listings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const buyListing = async (req, res) => {
  const transaction = await db.transaction();
  try {
    const { id } = req.params;
    const { buyer_role, buyer_id } = req.body;
    if (!buyer_role || !buyer_id) {
      await transaction.rollback();
      return res.status(400).json({ message: "Buyer wajib diisi." });
    }

    const listing = await MarketListing.findOne({ where: { id_listing: id } });
    if (!listing || listing.status !== "active") {
      await transaction.rollback();
      return res.status(404).json({ message: "Listing tidak tersedia." });
    }
    if (listing.seller_role === buyer_role && Number(listing.seller_id) === Number(buyer_id)) {
      await transaction.rollback();
      return res.status(400).json({ message: "Tidak bisa membeli listing sendiri." });
    }

    const buyer = await getUserByRole(buyer_role, buyer_id);
    if (!buyer) {
      await transaction.rollback();
      return res.status(404).json({ message: "Buyer tidak ditemukan." });
    }

    const seller = await getUserByRole(listing.seller_role, listing.seller_id);
    if (!seller) {
      await transaction.rollback();
      return res.status(404).json({ message: "Seller tidak ditemukan." });
    }

    if ((buyer.koin || 0) < listing.price) {
      await transaction.rollback();
      return res.status(400).json({ message: "Koin tidak cukup." });
    }

    const taxAmount = Math.floor(listing.price * TAX_RATE);
    const sellerGain = listing.price - taxAmount;

    await buyer.update({ koin: (buyer.koin || 0) - listing.price }, { transaction });
    await seller.update({ koin: (seller.koin || 0) + sellerGain }, { transaction });

    const owner = await getDefaultOwner();
    if (owner && taxAmount > 0) {
      await owner.update({ total_koin: (owner.total_koin || 0) + taxAmount }, { transaction });
    }

    await listing.update({ status: "sold" }, { transaction });
    const trx = await MarketTransaction.create(
      {
        id_listing: listing.id_listing,
        seller_role: listing.seller_role,
        seller_id: listing.seller_id,
        buyer_role,
        buyer_id,
        price: listing.price,
        tax_amount: taxAmount,
      },
      { transaction }
    );

    await transaction.commit();
    res.status(200).json({ message: "Transaksi berhasil.", data: trx });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: error.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const { role, id } = req.params;
    const transactions = await MarketTransaction.findAll({
      where: {
        [Op.or]: [
          { seller_role: role, seller_id: id },
          { buyer_role: role, buyer_id: id },
        ],
      },
      order: [["created_at", "DESC"]],
    });
    res.status(200).json({ data: transactions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
