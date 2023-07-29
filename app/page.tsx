"use client";
import {
  IconBookUpload,
  IconCirclePlus,
  IconEye,
  IconEyeClosed,
} from "@tabler/icons-react";
import { useCallback, useState } from "react";
import { twMerge } from "tailwind-merge";

interface Book {
  id: number;
  url: string;
}

const BASE_BOOK: Book = {
  id: 0,
  url: "",
};

export default function Page() {
  const [url, setUrl] = useState<string>("");
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<number>(0);
  const [hide, setHide] = useState<boolean>(false);

  const handleNewBook = useCallback(() => {
    setBooks([
      ...books,
      {
        ...BASE_BOOK,
        id: books.length + 1,
      },
    ]);
  }, [books]);

  const setBookImage = useCallback(() => {
    if (!selectedBook) {
      return;
    }
    setBooks(
      books?.map((book) => (book.id === selectedBook ? { ...book, url } : book))
    );
    setUrl("");
  }, [url, selectedBook, books]);

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row">
        <div
          onClick={() => setHide(!hide)}
          className="md:mr-2 cursor-pointer mt-2 md:mt-0 flex-shrink-0 justify-center bg-gray-800 items-center flex p-2 rounded-lg hover:bg-gray-700 active:bg-gray-900"
        >
          {!hide ? (
            <IconEye className="flex-shrink-0" />
          ) : (
            <IconEyeClosed className="flex-shrink-0" />
          )}
        </div>
        {!hide && (
          <>
            <input
              placeholder="Book Image Url"
              className="mt-2 md:mt-0 mr-2 w-full bg-gray-900 p-2 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <div
              onClick={setBookImage}
              className="cursor-pointer mt-2 md:mt-0 flex-shrink-0 justify-center bg-gray-800 items-center flex p-2 rounded-lg hover:bg-gray-700 active:bg-gray-900"
            >
              <IconBookUpload className="flex-shrink-0" />
              <span className="flex-shrink-0">Set Image</span>
            </div>
          </>
        )}
      </div>
      <div className="flex mt-2 auto-cols-auto flex-wrap gap-2">
        {books?.map((book: Book) => (
          // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
          <img
            key={`book-id-${book.id}`}
            className={twMerge(
              "cursor-pointer grid place-items-center border rounded-md border-gray-500 text-gray-500 h-[4cm] w-[2.5cm] hover:border-white hover:text-white",
              !hide &&
                book.id === selectedBook &&
                "shadow-md border-solid shadow-cyan-500/50 border-sky-500 text-sky-500 hover:border-sky-500 hover:text-sky-500"
            )}
            src={book.url}
            onClick={() => setSelectedBook(book?.id)}
          />
        ))}
        {!hide && (
          <div
            onClick={handleNewBook}
            className="cursor-pointer grid place-items-center border rounded-md border-dashed border-gray-500 text-gray-500 h-[4cm] w-[2.5cm] hover:border-white hover:text-white"
          >
            <IconCirclePlus className="h-10 w-10" />
          </div>
        )}
      </div>
    </div>
  );
}
