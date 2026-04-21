import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFolders, createFolder, deleteFolder, updateFolder } from '../services/folderService';
import { getBlocks, createBlock, deleteBlock, updateBlock } from '../services/blockService';
import { logout } from '../services/authService';

export default function Dashboard() {
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [newFolderName, setNewFolderName] = useState('');
  const [newBlockTitle, setNewBlockTitle] = useState('');
  const [newBlockContent, setNewBlockContent] = useState('');
  const [showFolderForm, setShowFolderForm] = useState(false);
  const [showBlockForm, setShowBlockForm] = useState(false);
  const [editingBlock, setEditingBlock] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editingFolder, setEditingFolder] = useState(null);
  const [editFolderName, setEditFolderName] = useState('');
  const navigate = useNavigate();

  useEffect(() => { loadFolders(); }, []);
  useEffect(() => { if (selectedFolder) loadBlocks(selectedFolder.id); }, [selectedFolder]);

  const loadFolders = async () => {
    try {
      const data = await getFolders();
      setFolders(data);
    } catch (err) {
      navigate('/login');
    }
  };

  const loadBlocks = async (folderId) => {
    try {
      const data = await getBlocks(folderId);
      setBlocks(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    try {
      await createFolder(newFolderName, '');
      setNewFolderName('');
      setShowFolderForm(false);
      loadFolders();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFolder = async (id) => {
    try {
      await deleteFolder(id);
      if (selectedFolder?.id === id) {
        setSelectedFolder(null);
        setBlocks([]);
      }
      loadFolders();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditFolder = (folder, e) => {
    e.stopPropagation();
    setEditingFolder(folder.id);
    setEditFolderName(folder.name);
  };

  const handleSaveFolder = async (id, e) => {
    e.stopPropagation();
    try {
      await updateFolder(id, editFolderName, '');
      setEditingFolder(null);
      if (selectedFolder?.id === id) {
        setSelectedFolder(prev => ({ ...prev, name: editFolderName }));
      }
      loadFolders();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateBlock = async (e) => {
    e.preventDefault();
    try {
      await createBlock(selectedFolder.id, newBlockTitle, newBlockContent);
      setNewBlockTitle('');
      setNewBlockContent('');
      setShowBlockForm(false);
      loadBlocks(selectedFolder.id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBlock = async (id) => {
    try {
      await deleteBlock(id);
      loadBlocks(selectedFolder.id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditBlock = (block) => {
    setEditingBlock(block.id);
    setEditTitle(block.title);
    setEditContent(block.content);
  };

  const handleSaveBlock = async (id) => {
    try {
      await updateBlock(id, editTitle, editContent);
      setEditingBlock(null);
      loadBlocks(selectedFolder.id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <h2 style={styles.logo}>PrepApp</h2>
          <button style={styles.logoutBtn} onClick={handleLogout}>Salir</button>
        </div>

        <div style={styles.sidebarSection}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionTitle}>Carpetas</span>
            <button style={styles.addBtn} onClick={() => setShowFolderForm(!showFolderForm)}>+</button>
          </div>

          {showFolderForm && (
            <form onSubmit={handleCreateFolder} style={styles.inlineForm}>
              <input
                style={styles.inlineInput}
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Nombre de la carpeta"
                required
              />
              <button style={styles.inlineBtn} type="submit">Crear</button>
            </form>
          )}

          {folders.map(folder => (
            <div
              key={folder.id}
              style={{
                ...styles.folderItem,
                backgroundColor: selectedFolder?.id === folder.id ? '#e0e7ff' : 'transparent',
              }}
              onClick={() => setSelectedFolder(folder)}
            >
              <span style={styles.folderIcon}>📁</span>
              {editingFolder === folder.id ? (
                <>
                  <input
                    style={{ ...styles.inlineInput, margin: 0, flex: 1 }}
                    value={editFolderName}
                    onChange={(e) => setEditFolderName(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    autoFocus
                  />
                  <button
                    style={{ ...styles.inlineBtn, width: 'auto', padding: '2px 8px', marginLeft: '4px' }}
                    onClick={(e) => handleSaveFolder(folder.id, e)}
                  >✓</button>
                  <button
                    style={styles.deleteBtn}
                    onClick={(e) => { e.stopPropagation(); setEditingFolder(null); }}
                  >×</button>
                </>
              ) : (
                <>
                  <span style={styles.folderName}>{folder.name}</span>
                  <button
                    style={styles.editBtn}
                    onClick={(e) => handleEditFolder(folder, e)}
                  >✏️</button>
                  <button
                    style={styles.deleteBtn}
                    onClick={(e) => { e.stopPropagation(); handleDeleteFolder(folder.id); }}
                  >×</button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={styles.main}>
        {selectedFolder ? (
          <>
            <div style={styles.mainHeader}>
              <h2 style={styles.folderTitle}>{selectedFolder.name}</h2>
              <button style={styles.newBlockBtn} onClick={() => setShowBlockForm(!showBlockForm)}>
                + Nuevo bloque
              </button>
            </div>

            {showBlockForm && (
              <form onSubmit={handleCreateBlock} style={styles.blockForm}>
                <input
                  style={styles.blockInput}
                  value={newBlockTitle}
                  onChange={(e) => setNewBlockTitle(e.target.value)}
                  placeholder="Título del bloque"
                  required
                />
                <textarea
                  style={styles.blockTextarea}
                  value={newBlockContent}
                  onChange={(e) => setNewBlockContent(e.target.value)}
                  placeholder="Escribe tus apuntes aquí..."
                  rows={4}
                />
                <button style={styles.createBlockBtn} type="submit">Guardar bloque</button>
              </form>
            )}

            <div style={styles.blocksGrid}>
              {blocks.map(block => (
                <div key={block.id} style={styles.blockCard}>
                  {editingBlock === block.id ? (
                    <>
                      <input
                        style={styles.blockInput}
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                      />
                      <textarea
                        style={styles.blockTextarea}
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={4}
                      />
                      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                        <button style={styles.createBlockBtn} onClick={() => handleSaveBlock(block.id)}>
                          Guardar
                        </button>
                        <button
                          style={{ ...styles.createBlockBtn, backgroundColor: '#999' }}
                          onClick={() => setEditingBlock(null)}
                        >
                          Cancelar
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={styles.blockHeader}>
                        <h3 style={styles.blockTitle}>{block.title}</h3>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button style={styles.editBtn} onClick={() => handleEditBlock(block)}>✏️</button>
                          <button style={styles.deleteBtn} onClick={() => handleDeleteBlock(block.id)}>×</button>
                        </div>
                      </div>
                      <p style={styles.blockContent}>{block.content}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>Selecciona una carpeta o crea una nueva para comenzar</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' },
  sidebar: { width: '260px', backgroundColor: 'white', borderRight: '1px solid #eee', padding: '1rem', flexShrink: 0 },
  sidebarHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  logo: { fontSize: '20px', fontWeight: 'bold', color: '#4f46e5', margin: 0 },
  logoutBtn: { fontSize: '12px', padding: '4px 8px', cursor: 'pointer', border: '1px solid #ddd', borderRadius: '6px', background: 'white' },
  sidebarSection: { marginTop: '1rem' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  sectionTitle: { fontSize: '12px', fontWeight: '600', color: '#888', textTransform: 'uppercase' },
  addBtn: { background: '#4f46e5', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', fontSize: '16px' },
  inlineForm: { marginBottom: '8px' },
  inlineInput: { width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '13px', marginBottom: '4px', boxSizing: 'border-box' },
  inlineBtn: { width: '100%', padding: '6px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
  folderItem: { display: 'flex', alignItems: 'center', padding: '8px', borderRadius: '8px', cursor: 'pointer', marginBottom: '4px' },
  folderIcon: { marginRight: '8px', fontSize: '16px' },
  folderName: { flex: 1, fontSize: '14px', color: '#333' },
  deleteBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#999', fontSize: '16px', padding: '0 4px' },
  main: { flex: 1, padding: '2rem' },
  mainHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  folderTitle: { fontSize: '24px', fontWeight: 'bold', color: '#1a1a1a', margin: 0 },
  newBlockBtn: { padding: '8px 16px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  blockForm: { backgroundColor: 'white', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  blockInput: { width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', marginBottom: '8px', boxSizing: 'border-box' },
  blockTextarea: { width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', marginBottom: '8px', boxSizing: 'border-box', resize: 'vertical' },
  createBlockBtn: { padding: '8px 16px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  blocksGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' },
  blockCard: { backgroundColor: 'white', padding: '1rem', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  blockHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  blockTitle: { fontSize: '16px', fontWeight: '600', color: '#1a1a1a', margin: 0 },
  blockContent: { fontSize: '14px', color: '#555', lineHeight: '1.6', margin: 0 },
  emptyState: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' },
  emptyText: { fontSize: '16px', color: '#888' },
  editBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', padding: '0 4px' },
};