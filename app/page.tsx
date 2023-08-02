"use client";
import {
  IconBookUpload,
  IconCirclePlus,
  IconEye,
  IconEyeClosed,
  IconResize,
} from "@tabler/icons-react";
import { useCallback, useState } from "react";
import { twMerge } from "tailwind-merge";

interface Book {
  id: number;
  url: string;
}

interface Size {
  width: string;
  height: string;
}

const BASE_BOOK: Book = {
  id: 0,
  url: "",
};

export default function Page() {
  const [url, setUrl] = useState<string>("");
  const [size, setSize] = useState<Size>({
    width: "2.5",
    height: "4",
  });
  const [temporalSize, setTemporalSize] = useState<Size>({
    width: "2.5",
    height: "4",
  });
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

  const updateSize = useCallback(() => {
    const { width, height } = temporalSize;
    if (isNaN(Number(width)) || isNaN(Number(height))) {
      alert(
        "No se puede redimensionar. Uno de los datos ingresados no es un número."
      );
      return;
    }
    setSize({ width, height });
  }, [temporalSize]);

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
              placeholder="W"
              className="mt-2 md:mt-0 md:w-20 mr-2 w-full bg-gray-900 p-2 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              value={temporalSize.width}
              onChange={(e) =>
                setTemporalSize({ ...temporalSize, width: e.target.value })
              }
            />
            <input
              placeholder="H"
              className="mt-2 md:mt-0 md:w-20 mr-2 w-full bg-gray-900 p-2 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              value={temporalSize.height}
              onChange={(e) =>
                setTemporalSize({ ...temporalSize, height: e.target.value })
              }
            />
            <div
              onClick={updateSize}
              className="cursor-pointer mt-2 mr-0 md:mr-2 md:mt-0 flex-shrink-0 justify-center bg-gray-800 items-center flex p-2 rounded-lg hover:bg-gray-700 active:bg-gray-900"
              title="Resize"
            >
              <IconResize className="mr-2 flex-shrink-0" />
              <span className="flex-shrink-0">Resize</span>
            </div>
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
              <IconBookUpload className="flex-shrink-0 mr-2" />
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
              "cursor-pointer grid place-items-center border rounded-md border-gray-500 text-gray-500 hover:border-white hover:text-white",
              !hide &&
                book.id === selectedBook &&
                "shadow-md border-solid shadow-cyan-500/50 border-sky-500 text-sky-500 hover:border-sky-500 hover:text-sky-500"
            )}
            style={{ width: `${size.width}cm`, height: `${size.height}cm` }}
            src={book.url}
            onClick={() => setSelectedBook(book?.id)}
          />
        ))}
        {!hide && (
          <div
            onClick={handleNewBook}
            className="cursor-pointer grid place-items-center border rounded-md border-dashed border-gray-500 text-gray-500 hover:border-white hover:text-white"
            style={{ width: `${size.width}cm`, height: `${size.height}cm` }}
          >
            <IconCirclePlus className="h-10 w-10" />
          </div>
        )}
      </div>
    </div>
  );
}
