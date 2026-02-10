import { useState, useEffect } from 'react';
import Book, { type BookColor, type BookPattern } from "../imports/Book";
import { AddBookCard } from "./components/AddBookCard";

interface BookItem {
  id: string;
  title: string;
  color: BookColor;
  pattern: BookPattern;
}

export default function App() {
  const [books, setBooks] = useState<BookItem[]>([
    { id: '1', title: 'HANDBOOK', color: 'violet', pattern: 'simplu' },
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

  return (
    <div className="min-h-screen bg-white" lang="ro">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <h1 className="text-xl sm:text-2xl text-gray-900">Book Library</h1>
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
          {books.map((book) => (
            <div 
              key={book.id} 
              className="flex flex-col w-[200px]"
              role="article"
              aria-label={`Caiet ${book.title.charAt(0) + book.title.slice(1).toLowerCase()}`}
            >
              <div className="mb-4">
                <Book title={book.title} color={book.color} pattern={book.pattern} />
              </div>
              <h3 className="text-lg text-gray-900 mb-1 font-['Raleway']">
                {book.title.charAt(0) + book.title.slice(1).toLowerCase()}
              </h3>
            </div>
          ))}

          {/* Add new book card */}
          <AddBookCard onAdd={handleAddBook} />
        </div>
      </main>
    </div>
  );
}