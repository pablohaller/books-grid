// https://www.npmjs.com/package/react-countdown-circle-timer
"use client";
import {
  IconBookUpload,
  IconCirclePlus,
  IconDownload,
  IconEye,
  IconEyeClosed,
  IconReload,
  IconUpload,
} from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { twMerge } from "tailwind-merge";
import "react-toastify/dist/ReactToastify.css";

interface Book {
  id: number;
  name?: string;
  author?: string;
  saga?: string;
  url: string;
}

const BASE_BOOK: Book = {
  id: 0,
  name: "",
  author: "",
  saga: "",
  url: "",
};

export default function Page() {
  const [url, setUrl] = useState<string>("");
  const [csv, setCsv] = useState<string[][] | null>(null);
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

  const handleUploadFile = useCallback(async (e: any) => {
    e?.preventDefault();
    let file = e.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      const response = await fetch(fileUrl);
      const text = await response.text();
      const lines = text.split("\n");
      const _data = lines.map((line) => line.split(","));
      setCsv(_data);
    }
  }, []);

  const handleDownloadCSV = useCallback(() => {
    let csvText = "";
    csv?.forEach((row) => {
      csvText += row.join(",");
      csvText += "\n";
    });

    let csvFile = new Blob([csvText], { type: "text/csv" });
    let downloadLink = document.createElement("a");
    downloadLink.download = "Libros actualizados.csv";
    downloadLink.target = "_blank";
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";

    document.body.appendChild(downloadLink);
    downloadLink.click();
  }, [csv]);

  useEffect(() => {
    const csvToBooks: Book[] =
      csv?.map(([author, name, saga], index) => {
        return { id: books?.length + index, author, name, saga, url: "" };
      }) || [];
    csvToBooks.shift();

    setBooks(csvToBooks);
  }, [csv]);

  const getBookData = useCallback(() => {
    const selectedBookData = books.find(
      (book: Book) => book.id === selectedBook
    );
    if (!selectedBook) {
      return null;
    }
    if (selectedBookData?.name) {
      return (
        <div className="mt-2">
          <span className="font-bold">Nombre:&nbsp;</span>
          <span>{selectedBookData?.name},&nbsp;</span>
          <span className="font-bold">Autor:&nbsp;</span>
          <span>{selectedBookData?.author},&nbsp;</span>
          <span className="font-bold">Saga:&nbsp;</span>
          <span>{selectedBookData?.saga}</span>
        </div>
      );
    }
    return null;
  }, [books, selectedBook]);

  return (
    <>
      <ToastContainer />
      <div className="p-4 ">
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
          <input
            type="file"
            id="selectedFile"
            style={{ display: "none" }}
            onChange={handleUploadFile}
          />
          {!hide && (
            <div
              onClick={() => {
                document?.getElementById("selectedFile")?.click();
              }}
              className="md:mr-2 cursor-pointer mt-2 md:mt-0 flex-shrink-0 justify-center bg-gray-800 items-center flex p-2 rounded-lg hover:bg-gray-700 active:bg-gray-900"
            >
              <IconUpload className="flex-shrink-0" />
            </div>
          )}
          {!hide && (
            <div
              onClick={handleDownloadCSV}
              className="md:mr-2 cursor-pointer mt-2 md:mt-0 flex-shrink-0 justify-center bg-gray-800 items-center flex p-2 rounded-lg hover:bg-gray-700 active:bg-gray-900"
            >
              <IconDownload className="flex-shrink-0" />
            </div>
          )}
          {!hide && (
            <div
              onClick={() => toast.info("load images")}
              className="md:mr-2 cursor-pointer mt-2 md:mt-0 flex-shrink-0 justify-center bg-gray-800 items-center flex p-2 rounded-lg hover:bg-gray-700 active:bg-gray-900"
            >
              <IconReload className="flex-shrink-0" />
            </div>
          )}
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
        {!hide && getBookData()}
        <div
          className={twMerge(
            "flex mt-2 auto-cols-auto flex-wrap gap-2",
            hide && "gap-1"
          )}
        >
          {books?.map((book: Book) =>
            book?.url ? (
              // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
              <img
                key={`book-id-${book.id}`}
                className={twMerge(
                  "cursor-pointer grid place-items-center border rounded-md border-gray-500 text-gray-500 h-[4cm] w-[2.5cm] hover:border-white hover:text-white",
                  !hide &&
                    book.id === selectedBook &&
                    "shadow-md border-solid shadow-cyan-500/50 border-sky-500 text-sky-500 hover:border-sky-500 hover:text-sky-500",
                  hide && "rounded-none border-none"
                )}
                src={book.url}
                onClick={() => setSelectedBook(book?.id)}
              />
            ) : !hide ? (
              <div
                key={`book-id-${book.id}`}
                className={twMerge(
                  "p-2 break-all text-center line-clamp-3 cursor-pointer grid place-items-center border rounded-md border-gray-500 text-gray-500 h-[4cm] w-[2.5cm] hover:border-white hover:text-white",
                  !hide &&
                    book.id === selectedBook &&
                    "shadow-md border-solid shadow-cyan-500/50 border-sky-500 text-sky-500 hover:border-sky-500 hover:text-sky-500",
                  hide && "rounded-none border-none"
                )}
                onClick={() => setSelectedBook(book?.id)}
              >
                <span>{book?.name}</span>
              </div>
            ) : null
          )}
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
    </>
  );
}
