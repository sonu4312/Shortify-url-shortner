import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Copy, Trash, Download } from "lucide-react";
import useFetch from "@/hooks/useFetch";
import { deleteUrl } from "@/db/apiUrl";
import { BeatLoader } from "react-spinners";

const LinkCard = ({ url, fetchUrls }) => {
  const shortifyUrl = import.meta.env.VITE_SHORTIFY_URL;
  const [copied, setCopied] = useState(false);

  const downloadImage = async () => {
    const imageUrl = url?.qr;
    const fileName = url?.title;
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const urlBlob = window.URL.createObjectURL(blob);

    const anchorTag = document.createElement("a");
    anchorTag.href = urlBlob;
    anchorTag.download = fileName;
    document.body.appendChild(anchorTag);
    anchorTag.click();
    document.body.removeChild(anchorTag);
    window.URL.revokeObjectURL(urlBlob);
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(`${shortifyUrl}/${url?.short_url}`)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
      });
  };

  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, url?.id);
  return (
    <div className="flex flex-col md:flex-row gap-5 border p-4 bg-gray-900 rounded-lg">
      <img
        src={url?.qr}
        alt="qr code"
        className="h-32 object-contain ring ring-blue-500 self-start"
      />
      <Link to={`/link/${url?.id}`} className="flex flex-col flex-1 overflow-hidden">
        <span className="text-xl sm:text-2xl font-extrabold hover:underline cursor-pointer">
          {url?.title}
        </span>
        <span className="text-lg sm:text-xl text-blue-400 font-bold hover:underline cursor-pointer">
          {shortifyUrl}/{url?.custom_url ? url.custom_url : url.short_url}
        </span>
        <span className="text-sm sm:text-base flex items-center gap-1 hover:underline cursor-pointer">
          {url?.original_url}
        </span>
        <span className="flex items-end font-extralight text-xs sm:text-sm flex-1">
          {new Date(url?.created_at).toLocaleString()}
        </span>
      </Link>

      <div className="flex gap-2">
        <div className="relative">
          <Button variant="ghost" onClick={handleCopy}>
            <Copy />
          </Button>
          {copied && (
            <span className="absolute top-[-20px] right-0 text-sm text-slate-400">
              Copied!
            </span>
          )}
        </div>
        <Button variant="ghost" onClick={downloadImage}>
          <Download />
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            fnDelete().then(() => fetchUrls());
          }}
        >
          {loadingDelete ? <BeatLoader size={5} color="white" /> : <Trash />}
        </Button>
      </div>
    </div>
  );
};

export default LinkCard;
