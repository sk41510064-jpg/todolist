import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, CheckCircle2, Circle, Sparkles, X } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/todos';

function App() {
  const [todos, setTodos] = useState([]); // Default empty array
  const [title, setTitle] = useState('');
  const [subtask, setSubtask] = useState('');
  const [tempChecklist, setTempChecklist] = useState([]);

  useEffect(() => { fetchTodos(); }, []);

  const fetchTodos = async () => {
    try {
      const res = await axios.get(API_URL);
      // 🔥 Safety Check: Agar res.data array nahi hai toh empty array set karo
      if (Array.isArray(res.data)) {
        setTodos(res.data);
      } else {
        console.error("Backend sent non-array data:", res.data);
        setTodos([]);
      }
    } catch (err) { 
      console.error("API Error", err); 
      setTodos([]); // Error aane par crash na ho isliye empty array
    }
  };

  const addTempSubtask = () => {
    if (!subtask.trim()) return;
    setTempChecklist([...tempChecklist, { text: subtask, isCompleted: false }]);
    setSubtask('');
  };

  const removeTempSubtask = (index) => {
    setTempChecklist(tempChecklist.filter((_, i) => i !== index));
  };

  const saveTodo = async (e) => {
    if (e) e.preventDefault();
    if (!title.trim()) return;
    try {
      await axios.post(API_URL, { title, checklist: tempChecklist });
      setTitle(''); setTempChecklist([]); fetchTodos();
    } catch (err) { alert("Save failed"); }
  };

  const toggleSubtask = async (tId, iId) => {
    try {
      await axios.patch(`${API_URL}/${tId}/checklist/${iId}`);
      fetchTodos();
    } catch (err) { console.error(err); }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTodos();
    } catch (err) { console.error(err); }
  };

  return (
    <div 
      className="min-h-screen text-slate-100 font-sans selection:bg-indigo-500/30"
      style={{
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.48), rgba(0, 0, 0, 0.24)), url('/bged.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="p-6 md:p-12 max-w-5xl mx-auto">
        
        {/* LOGO SECTION */}
        <header className="flex flex-col items-center mb-16 animate-float">
          <div className="glass px-6 py-2 rounded-2xl flex items-center gap-3">
            <Sparkles className="text-indigo-400 w-5 h-5" />
            <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent italic tracking-tight">
              TaskFlow
            </h1>
          </div>
        </header>

        {/* INPUT BOX */}
        <div className="flex justify-center mb-20">
          <section className="glass rounded-[2.5rem] p-8 md:p-10 w-full max-w-2xl border border-white/5 shadow-2xl">
            <form onSubmit={saveTodo} className="space-y-6">
              <input
                className="w-full bg-transparent text-3xl font-bold text-center border-none focus:ring-0 outline-none placeholder-slate-600"
                placeholder="What's the main goal?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <div className="flex gap-3 bg-white/5 p-2 rounded-2xl border border-white/5">
                <input
                  className="flex-1 bg-transparent px-4 py-2 outline-none text-sm placeholder-slate-500"
                  placeholder="Add a sub-step..."
                  value={subtask}
                  onChange={(e) => setSubtask(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTempSubtask())}
                />
                <button
                  type="button"
                  onClick={addTempSubtask}
                  className="p-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-400 transition-all active:scale-90"
                >
                  <Plus size={20} />
                </button>
              </div>

              {/* TEMP SUBTASKS LIST */}
              <div className="flex flex-wrap gap-2 justify-center">
                <AnimatePresence>
                  {tempChecklist.map((item, index) => (
                    <motion.span 
                      initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      key={index} 
                      className="flex items-center gap-2 bg-indigo-500/10 text-indigo-300 px-4 py-1.5 rounded-full text-xs border border-indigo-500/20"
                    >
                      {item.text}
                      <X size={14} className="cursor-pointer hover:text-white" onClick={() => removeTempSubtask(index)} />
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
              >
                Create Master Task
              </button>
            </form>
          </section>
        </div>

        {/* DISPLAY GRID - 🔥 Added Array check here too */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 auto-rows-fr">
          <AnimatePresence mode="popLayout">
            {Array.isArray(todos) && todos.map((todo) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={todo._id}
                className="glass glass-hover p-8 rounded-[2rem] flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl font-bold text-white tracking-tight leading-tight">{todo.title}</h3>
                  <button onClick={() => deleteTodo(todo._id)} className="text-slate-600 hover:text-red-400 transition-colors p-1">
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="space-y-4 flex-grow">
                  {todo.checklist && todo.checklist.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => toggleSubtask(todo._id, item._id)}
                      className="flex items-center gap-4 cursor-pointer group/item"
                    >
                      {item.isCompleted ? (
                        <CheckCircle2 className="text-emerald-400 shrink-0" size={20} />
                      ) : (
                        <Circle className="text-slate-700 group-hover/item:text-indigo-400 shrink-0" size={20} />
                      )}
                      <span className={`text-[15px] transition-all ${item.isCompleted ? 'line-through text-slate-500' : 'text-slate-300 font-medium'}`}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default App;