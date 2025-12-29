import Guild from "../models/GuildModel.js";
import GuildMember from "../models/GuildMemberModel.js";
import Petualang from "../models/PetualangModel.js";

export const getGuilds = async (req, res) => {
  try {
    const guilds = await Guild.findAll({
      include: [{ model: Petualang, as: "leader" }],
    });
    res.status(200).json({ data: guilds });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getGuildById = async (req, res) => {
  try {
    const guild = await Guild.findOne({
      where: { id_guild: req.params.id },
      include: [{ model: Petualang, as: "leader" }],
    });
    if (!guild) return res.status(404).json({ message: "Guild tidak ditemukan" });
    res.status(200).json({ data: guild });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createGuild = async (req, res) => {
  try {
    const { name, motto, id_petualang } = req.body;
    if (!name || !id_petualang) {
      return res.status(400).json({ message: "Nama guild dan leader wajib." });
    }

    const petualang = await Petualang.findOne({ where: { id_petualang } });
    if (!petualang)
      return res.status(404).json({ message: "Petualang tidak ditemukan" });

    const existingMembership = await GuildMember.findOne({
      where: { id_petualang },
    });
    if (existingMembership) {
      return res.status(400).json({ message: "Petualang sudah berada di guild." });
    }

    const guild = await Guild.create({
      name,
      motto,
      leader_id: id_petualang,
    });

    await GuildMember.create({
      id_guild: guild.id_guild,
      id_petualang,
      role: "leader",
    });

    res.status(201).json({ data: guild });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const joinGuild = async (req, res) => {
  try {
    const { id_guild } = req.params;
    const { id_petualang } = req.body;
    const guild = await Guild.findOne({ where: { id_guild } });
    if (!guild) return res.status(404).json({ message: "Guild tidak ditemukan" });

    const existingMembership = await GuildMember.findOne({
      where: { id_petualang },
    });
    if (existingMembership) {
      return res.status(400).json({ message: "Petualang sudah berada di guild lain." });
    }

    const existing = await GuildMember.findOne({
      where: { id_guild, id_petualang },
    });
    if (existing) {
      return res.status(400).json({ message: "Petualang sudah bergabung." });
    }

    await GuildMember.create({ id_guild, id_petualang, role: "member" });
    res.status(200).json({ message: "Berhasil bergabung guild." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const leaveGuild = async (req, res) => {
  try {
    const { id_guild } = req.params;
    const { id_petualang } = req.body;
    const member = await GuildMember.findOne({
      where: { id_guild, id_petualang },
    });
    if (!member) {
      return res.status(404).json({ message: "Keanggotaan tidak ditemukan" });
    }
    if (member.role === "leader") {
      return res.status(400).json({ message: "Leader tidak bisa keluar tanpa transfer." });
    }
    await GuildMember.destroy({ where: { id_guild, id_petualang } });
    res.status(200).json({ message: "Keluar dari guild berhasil." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const transferLeader = async (req, res) => {
  try {
    const { id_guild } = req.params;
    const { id_petualang, id_petualang_baru } = req.body;

    const guild = await Guild.findOne({ where: { id_guild } });
    if (!guild) return res.status(404).json({ message: "Guild tidak ditemukan" });
    if (Number(guild.leader_id) !== Number(id_petualang)) {
      return res.status(403).json({ message: "Hanya leader yang bisa transfer." });
    }

    const newLeader = await GuildMember.findOne({
      where: { id_guild, id_petualang: id_petualang_baru },
    });
    if (!newLeader) {
      return res.status(404).json({ message: "Petualang baru belum jadi anggota." });
    }

    await guild.update({ leader_id: id_petualang_baru });
    await GuildMember.update(
      { role: "member" },
      { where: { id_guild, id_petualang } }
    );
    await GuildMember.update(
      { role: "leader" },
      { where: { id_guild, id_petualang: id_petualang_baru } }
    );

    res.status(200).json({ message: "Leader guild berhasil ditransfer." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getGuildMembers = async (req, res) => {
  try {
    const { id_guild } = req.params;
    const members = await GuildMember.findAll({
      where: { id_guild },
      include: [Petualang],
    });
    res.status(200).json({ data: members });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getGuildByPetualang = async (req, res) => {
  try {
    const { id_petualang } = req.params;
    const membership = await GuildMember.findOne({
      where: { id_petualang },
      include: [Guild],
    });
    res.status(200).json({ data: membership });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
