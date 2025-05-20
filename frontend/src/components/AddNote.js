import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils";

const AddNote = () => {
    const [judul, setJudul] = useState("");
    const [kategori, setKategori] = useState("");
    const [isi, setIsi] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const saveNote = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("accessToken");

        if (!token) {
            setErrorMessage("Anda harus login terlebih dahulu.");
            return;
        }

        try {
            const response = await axios.post(
                `${BASE_URL}/note`,
                { judul, kategori, isi },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("Note saved:", response.data);
            navigate("/note");
        } catch (error) {
            console.error("Save error:", error.response || error.message);
            setErrorMessage(error.response?.data?.message || "Gagal menyimpan catatan.");
        }
    };

    const handleBack = () => {
        navigate("/note");
    };

    return (
        <div style={styles.container}>
            {/* Moonlight Sonata Decorative Elements */}
            <div style={styles.moon}></div>
            <div style={styles.pianoKeys}></div>

            <div style={styles.contentWrapper}>
                <button
                    style={styles.backButton}
                    onClick={handleBack}
                >
                    <span style={styles.backIcon}>⌨</span> {/* Piano key icon */}
                </button>

                <h1 style={styles.title}>
                    <span style={styles.titleMain}>Compose New Note</span>
                    <span style={styles.titleSub}>Moonlight Sonata Edition</span>
                </h1>

                <div style={styles.sheetMusicTop}></div>

                <form onSubmit={saveNote} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>
                            <span style={styles.labelText}>Judul</span>
                            <input
                                type="text"
                                placeholder="Sonata in C# Minor..."
                                value={judul}
                                onChange={(e) => setJudul(e.target.value)}
                                required
                                style={styles.input}
                            />
                        </label>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>
                            <span style={styles.labelText}>Kategori</span>
                            <select
                                value={kategori}
                                onChange={(e) => setKategori(e.target.value)}
                                required
                                style={styles.select}
                            >
                                <option value="">-- Select Movement --</option>
                                <option value="Adagio">Adagio (Pribadi)</option>
                                <option value="Allegretto">Allegretto (Pekerjaan)</option>
                                <option value="Presto">Presto (Keuangan)</option>
                                <option value="Andante">Andante (Pendidikan)</option>
                                <option value="Scherzo">Scherzo (Kesehatan)</option>
                                <option value="Rondo">Rondo (Hiburan)</option>
                                <option value="Nocturne">Nocturne (Lainnya)</option>
                            </select>
                        </label>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>
                            <span style={styles.labelText}>Isi Catatan</span>
                            <textarea
                                placeholder="Compose your musical thoughts..."
                                value={isi}
                                onChange={(e) => setIsi(e.target.value)}
                                required
                                style={styles.textarea}
                            />
                        </label>
                    </div>

                    <button type="submit" style={styles.submitButton}>
                        <span style={styles.buttonText}>Save Composition</span>
                        <span style={styles.buttonIcon}>♫</span>
                    </button>
                </form>

                <div style={styles.sheetMusicBottom}></div>

                {errorMessage && (
                    <p style={styles.errorMessage}>{errorMessage}</p>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#050811',
        background: 'radial-gradient(ellipse at top, #1a1a2e 0%, #050811 70%)',
        color: '#e0e0e0',
        fontFamily: "'Cormorant Garamond', serif",
        position: 'relative',
        overflow: 'hidden',
        padding: '2rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentWrapper: {
        maxWidth: '800px',
        width: '100%',
        position: 'relative',
        zIndex: 2,
    },
    moon: {
        position: 'absolute',
        top: '-50px',
        right: '-50px',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(179,157,219,0.2) 0%, rgba(179,157,219,0) 70%)',
        borderRadius: '50%',
        boxShadow: '0 0 100px rgba(179, 157, 219, 0.3)',
    },
    pianoKeys: {
        position: 'absolute',
        bottom: '0',
        left: '0',
        width: '100%',
        height: '60px',
        background: `
            repeating-linear-gradient(
                90deg,
                #000 0, #000 30px,
                #fff 30px, #fff 36px,
                #000 36px, #000 66px,
                #fff 66px, #fff 72px
            )`,
        opacity: '0.1',
    },
    backButton: {
        background: 'transparent',
        border: 'none',
        color: '#b39ddb',
        fontSize: '2rem',
        cursor: 'pointer',
        marginBottom: '1rem',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        padding: '0.5rem',
    },
    backIcon: {
        fontSize: '1.5rem',
        marginRight: '0.5rem',
        transform: 'rotate(180deg)',
    },
    title: {
        color: '#b39ddb',
        textAlign: 'center',
        marginBottom: '2rem',
        display: 'flex',
        flexDirection: 'column',
    },
    titleMain: {
        fontSize: '2.8rem',
        fontWeight: '600',
        letterSpacing: '2px',
        textShadow: '0 0 15px rgba(179, 157, 219, 0.7)',
    },
    titleSub: {
        fontSize: '1rem',
        fontStyle: 'italic',
        opacity: '0.8',
        marginTop: '0.5rem',
        letterSpacing: '5px',
    },
    sheetMusicTop: {
        height: '40px',
        background: 'linear-gradient(to bottom, rgba(26,26,46,0.8) 0%, rgba(26,26,46,0) 100%)',
        borderTop: '1px solid rgba(179, 157, 219, 0.2)',
        borderBottom: '1px solid rgba(179, 157, 219, 0.2)',
        marginBottom: '2rem',
        position: 'relative',
    },
    sheetMusicBottom: {
        height: '40px',
        background: 'linear-gradient(to top, rgba(26,26,46,0.8) 0%, rgba(26,26,46,0) 100%)',
        borderTop: '1px solid rgba(179, 157, 219, 0.2)',
        borderBottom: '1px solid rgba(179, 157, 219, 0.2)',
        marginTop: '2rem',
        position: 'relative',
    },
    form: {
        backgroundColor: 'rgba(10, 14, 26, 0.7)',
        borderRadius: '5px',
        padding: '2rem',
        border: '1px solid rgba(179, 157, 219, 0.2)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
    },
    formGroup: {
        marginBottom: '1.5rem',
    },
    label: {
        display: 'block',
    },
    labelText: {
        display: 'block',
        marginBottom: '0.5rem',
        color: '#b39ddb',
        fontSize: '1.1rem',
        letterSpacing: '1px',
    },
    input: {
        width: '100%',
        padding: '0.8rem 1rem',
        marginBottom: '0.5rem',
        borderRadius: '3px',
        border: '1px solid #2d2d42',
        backgroundColor: 'rgba(15, 20, 40, 0.8)',
        color: '#e0e0e0',
        fontSize: '1rem',
        transition: 'all 0.3s ease',
        outline: 'none',
        fontFamily: "'Cormorant Garamond', serif",
        letterSpacing: '0.5px',
        boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.5)',
    },
    select: {
        width: '100%',
        padding: '0.8rem 1rem',
        marginBottom: '0.5rem',
        borderRadius: '3px',
        border: '1px solid #2d2d42',
        backgroundColor: 'rgba(15, 20, 40, 0.8)',
        color: '#e0e0e0',
        fontSize: '1rem',
        appearance: 'none',
        outline: 'none',
        fontFamily: "'Cormorant Garamond', serif",
        letterSpacing: '0.5px',
        boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.5)',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23b39ddb' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 1rem center',
        backgroundSize: '1rem',
    },
    textarea: {
        width: '100%',
        padding: '1rem',
        marginBottom: '0.5rem',
        borderRadius: '3px',
        border: '1px solid #2d2d42',
        backgroundColor: 'rgba(15, 20, 40, 0.8)',
        color: '#e0e0e0',
        fontSize: '1rem',
        minHeight: '200px',
        resize: 'vertical',
        outline: 'none',
        transition: 'all 0.3s ease',
        fontFamily: "'Cormorant Garamond', serif",
        lineHeight: '1.6',
        letterSpacing: '0.5px',
        boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.5)',
    },
    submitButton: {
        width: '100%',
        padding: '1.2rem',
        backgroundColor: 'transparent',
        color: '#b39ddb',
        border: '1px solid #4a148c',
        borderRadius: '3px',
        fontSize: '1.1rem',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        fontWeight: '600',
        letterSpacing: '1px',
        textTransform: 'uppercase',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 5px 15px rgba(74, 20, 140, 0.4)',
    },
    buttonText: {
        position: 'relative',
        zIndex: 2,
    },
    buttonIcon: {
        position: 'relative',
        zIndex: 2,
        marginLeft: '10px',
        fontSize: '1.2rem',
    },
    errorMessage: {
        color: '#ff6b6b',
        textAlign: 'center',
        marginTop: '1.5rem',
        fontSize: '1rem',
        fontStyle: 'italic',
    },
};

export default AddNote;
