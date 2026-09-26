import React, { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { api } from '../../services/api';
import { Product, University, Course, Semester, Subject } from '../../types';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  X,
  Save,
  BookOpen,
  Sparkles,
} from 'lucide-react';

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(149);
  const [compareAtPrice, setCompareAtPrice] = useState<number | undefined>(299);
  const [thumbnail, setThumbnail] = useState('');
  const [pages, setPages] = useState(120);
  const [fileSize, setFileSize] = useState('5.0 MB');
  const [edition, setEdition] = useState('2026 CBCS Edition');
  const [author, setAuthor] = useState('Backlog Saver Editorial Board');
  const [language, setLanguage] = useState('English');
  const [universityId, setUniversityId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [semesterId, setSemesterId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, univs, crses, sems, subjs] = await Promise.all([
        api.getAdminProducts(),
        api.getUniversities(),
        api.getCourses(),
        api.getSemesters(),
        api.getSubjects(),
      ]);
      setProducts(prods);
      setUniversities(univs);
      setCourses(crses);
      setSemesters(sems);
      setSubjects(subjs);
      if (univs.length > 0 && !universityId) setUniversityId(univs[0].id);
      if (crses.length > 0 && !courseId) setCourseId(crses[0].id);
      if (sems.length > 0 && !semesterId) setSemesterId(sems[0].id);
      if (subjs.length > 0 && !subjectId) setSubjectId(subjs[0].id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setTitle('');
    setShortDescription('High-yield exam revision guide & solved PYQs.');
    setDescription('Comprehensive point-wise study material aligned with CBCS/NEP syllabus.');
    setPrice(149);
    setCompareAtPrice(299);
    setThumbnail('https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=800&fit=crop&q=80');
    setPages(120);
    setFileSize('5.2 MB');
    setEdition('2026 Revised Edition');
    setAuthor('Backlog Saver Editorial Board');
    setLanguage('English');
    setIsFeatured(false);
    setIsPublished(true);
    setIsModalOpen(true);
  };

  const openEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setTitle(prod.title);
    setShortDescription(prod.shortDescription);
    setDescription(prod.description);
    setPrice(prod.price);
    setCompareAtPrice(prod.compareAtPrice);
    setThumbnail(prod.thumbnail);
    setPages(prod.pages);
    setFileSize(prod.fileSize);
    setEdition(prod.edition || '2026 Edition');
    setAuthor(prod.author || 'Editorial Board');
    setLanguage(prod.language);
    setUniversityId(prod.universityId);
    setCourseId(prod.courseId);
    setSemesterId(prod.semesterId);
    setSubjectId(prod.subjectId);
    setIsFeatured(prod.isFeatured);
    setIsPublished(prod.isPublished);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title,
        shortDescription,
        description,
        price,
        compareAtPrice,
        thumbnail,
        pages,
        fileSize,
        edition,
        author,
        language,
        universityId,
        courseId,
        semesterId,
        subjectId,
        isFeatured,
        isPublished,
      };

      if (editingProduct) {
        await api.updateAdminProduct(editingProduct.productId, payload);
      } else {
        await api.createAdminProduct(payload);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to archive this product?')) return;
    try {
      await api.deleteAdminProduct(id);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete product');
    }
  };

  return (
    <AdminLayout activeTab="products">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Study Materials Management</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Create, edit, price, and manage PDF study notes across university programs.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="bg-purple-600 hover:bg-purple-700 active:scale-98 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs shadow-purple-600/30 transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add New Material
          </button>
        </div>

        {/* Product Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="py-3 px-4">Title & Details</th>
                <th className="py-3 px-4">University & Subject</th>
                <th className="py-3 px-4">Price (₹)</th>
                <th className="py-3 px-4">Sales</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {products.map((prod) => {
                const univ = universities.find((u) => u.id === prod.universityId);
                const subj = subjects.find((s) => s.id === prod.subjectId);
                return (
                  <tr key={prod.productId} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img src={prod.thumbnail} alt={prod.title} className="w-9 h-12 rounded object-cover border border-slate-200 dark:border-slate-700" />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white line-clamp-1">{prod.title}</div>
                          <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                            {prod.pages} Pages • {prod.fileSize}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{univ?.code || 'DU'}</div>
                      <div className="text-slate-500 dark:text-slate-400 text-[11px]">{subj?.name || 'Arts'}</div>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      ₹{prod.price}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-indigo-600 dark:text-indigo-400">
                      {prod.salesCount || 0}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          prod.isPublished && prod.isActive
                            ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {prod.isPublished && prod.isActive ? 'Published' : 'Archived'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(prod)}
                          className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 rounded-lg transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(prod.productId)}
                          className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                          title="Archive"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl border border-slate-200 dark:border-slate-800 text-xs animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {editingProduct ? 'Edit Study Material' : 'Create New Study Material'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Political Theory: Concepts and Debates Exam Notes"
                  required
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    required
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Compare Price (₹)</label>
                  <input
                    type="number"
                    value={compareAtPrice || ''}
                    onChange={(e) => setCompareAtPrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl font-medium"
                  />
                </div>
              </div>

              {/* Hierarchy Selection */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">University</label>
                  <select
                    value={universityId}
                    onChange={(e) => setUniversityId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl font-medium"
                  >
                    {universities.map((u) => (
                      <option key={u.id} value={u.id} className="dark:bg-slate-800 text-slate-900 dark:text-white">{u.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Course</label>
                  <select
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl font-medium"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id} className="dark:bg-slate-800 text-slate-900 dark:text-white">{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Semester</label>
                  <select
                    value={semesterId}
                    onChange={(e) => setSemesterId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl font-medium"
                  >
                    {semesters.map((s) => (
                      <option key={s.id} value={s.id} className="dark:bg-slate-800 text-slate-900 dark:text-white">{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Subject</label>
                  <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl font-medium"
                  >
                    {subjects.map((sub) => (
                      <option key={sub.id} value={sub.id} className="dark:bg-slate-800 text-slate-900 dark:text-white">{sub.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Total Pages</label>
                  <input
                    type="number"
                    value={pages}
                    onChange={(e) => setPages(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">File Size</label>
                  <input
                    type="text"
                    value={fileSize}
                    onChange={(e) => setFileSize(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Edition</label>
                  <input
                    type="text"
                    value={edition}
                    onChange={(e) => setEdition(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Thumbnail Image URL</label>
                <input
                  type="url"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  placeholder="https://..."
                  required
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Short Description</label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl font-medium"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="rounded text-purple-600 w-4 h-4"
                  />
                  <span>Published on Store</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded text-purple-600 w-4 h-4"
                  />
                  <span>Featured on Homepage</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-98 text-white font-bold shadow-xs shadow-purple-600/30 disabled:opacity-50 cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Save Study Material'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
