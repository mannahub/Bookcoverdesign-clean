import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Book, { type BookColor, type BookPattern } from "../imports/Book";
import { AddBookCard } from "./components/AddBookCard";
import InteractiveBookDemo from "./pages/InteractiveBookDemo";

interface BookItem {
  id: string;
  title: string;
  color: BookColor;
  pattern: BookPattern;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<'library' | 'interactive'>('library');
  const [books, setBooks] = useState<BookItem[]>([
    { id: '1', title: 'HANDBOOK', color: 'purple', pattern: 'simplu' },
  ]);

  function handleAddBook(title: string, color: BookColor, pattern: BookPattern) {
    setBooks((prev) => [
      ...prev,
      { id: Date.now().toString(), title, color, pattern },
    ]);
  }

  // Set document language
  useEffect(() => {
    document.documentElement.lang = 'ro';
  }, []);

  // Show interactive demo page
  if (currentPage === 'interactive') {
    return <InteractiveBookDemo onBack={() => setCurrentPage('library')} />;
  }

  return (
    <div className="min-h-screen bg-white" lang="ro">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl text-gray-900">Book Library</h1>
          <button
            onClick={() => setCurrentPage('interactive')}
            style={{
              fontFamily: 'Geist',
              fontWeight: 500,
              fontSize: 14,
              padding: '8px 16px',
              borderRadius: 8,
              background: 'rgba(124,58,237,0.08)',
              border: 'none',
              color: '#7c3aed',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(124,58,237,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(124,58,237,0.08)';
            }}
          >
            Caiet 3D Interactiv
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8"
          style={{
            justifyItems: 'center',
          }}
        >
          {/* Existing books */}
          {books.map((book, index) => (
            <motion.div 
              key={book.id} 
              className="flex flex-col w-[200px]"
              role="article"
              aria-label={`Caiet ${book.title.charAt(0) + book.title.slice(1).toLowerCase()}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.06, ease: [0.22, 0.61, 0.36, 1] }}
            >
              <div className="mb-4">
                <Book title={book.title} color={book.color} pattern={book.pattern} />
              </div>
              <h3 className="text-lg text-gray-900 mb-1 font-medium">
                {book.title.charAt(0) + book.title.slice(1).toLowerCase()}
              </h3>
            </motion.div>
          ))}

          {/* Add new book card */}
          <AddBookCard onAdd={handleAddBook} />
        </div>
      </main>
    </div>
  );
}