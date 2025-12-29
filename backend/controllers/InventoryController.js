import Item from "../models/ItemModel.js";
import PetualangItem from "../models/PetualangItemModel.js";
import Petualang from "../models/PetualangModel.js";
import { createNotification } from "../services/NotificationService.js";

const DEFAULT_ITEMS = [
  {
    name: "Elixir XP",
    description: "Meningkatkan 1.5x XP untuk 30 menit.",
    type: "buff_xp",
    value: 1.5,
    duration_minutes: 30,
    price_koin: 120,
    icon: "potion-xp",
  },
  {
    name: "Kantong Emas",
    description: "Meningkatkan 1.3x koin untuk 30 menit.",
    type: "buff_koin",
    value: 1.3,
    duration_minutes: 30,
    price_koin: 100,
    icon: "pouch-gold",
  },
  {
    name: "Jubah Hoshigami",
    description: "Kosmetik eksklusif guild.",
    type: "cosmetic",
    value: 1,
    duration_minutes: 0,
    price_koin: 80,
    icon: "cloak",
  },
];

const seedItems = async () => {
  const count = await Item.count();
  if (count > 0) return;
  await Item.bulkCreate(DEFAULT_ITEMS);
};

export const getItems = async (req, res) => {
  try {
    await seedItems();
    const items = await Item.findAll();
    res.status(200).json({ data: items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getInventory = async (req, res) => {
  try {
    const { id_petualang } = req.params;
    const inventory = await PetualangItem.findAll({
      where: { id_petualang },
      include: [Item],
    });
    res.status(200).json({ data: inventory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const buyItem = async (req, res) => {
  try {
    const { id_petualang, id_item } = req.body;
    await seedItems();
    const item = await Item.findOne({ where: { id_item } });
    const petualang = await Petualang.findOne({ where: { id_petualang } });
    if (!item || !petualang) {
      return res.status(404).json({ message: "Item atau petualang tidak ditemukan." });
    }
    if ((petualang.koin || 0) < item.price_koin) {
      return res.status(400).json({ message: "Koin tidak cukup." });
    }
    await petualang.update({ koin: (petualang.koin || 0) - item.price_koin });

    const existing = await PetualangItem.findOne({
      where: { id_petualang, id_item },
    });
    if (existing) {
      await existing.update({ quantity: existing.quantity + 1 });
    } else {
      await PetualangItem.create({
        id_petualang,
        id_item,
        quantity: 1,
      });
    }

    await createNotification(
      id_petualang,
      "Item Baru Dibeli",
      `Kamu membeli ${item.name}.`,
      "system"
    );

    res.status(200).json({ message: "Item berhasil dibeli." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const activateItem = async (req, res) => {
  try {
    const { id_petualang, id_item } = req.body;
    const inv = await PetualangItem.findOne({
      where: { id_petualang, id_item },
      include: [Item],
    });
    if (!inv || inv.quantity <= 0) {
      return res.status(404).json({ message: "Item tidak tersedia." });
    }
    if (inv.item.type === "cosmetic") {
      return res.status(400).json({ message: "Item kosmetik tidak bisa diaktifkan." });
    }
    const now = new Date();
    const expiresAt = new Date(
      now.getTime() + (inv.item.duration_minutes || 0) * 60000
    );
    await inv.update({
      is_active: true,
      activated_at: now,
      expires_at: expiresAt,
      quantity: inv.quantity - 1,
    });

    res.status(200).json({ message: "Item diaktifkan.", expires_at: expiresAt });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deactivateItem = async (req, res) => {
  try {
    const { id_petualang, id_item } = req.body;
    await PetualangItem.update(
      { is_active: false, activated_at: null, expires_at: null },
      { where: { id_petualang, id_item } }
    );
    res.status(200).json({ message: "Item dinonaktifkan." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
