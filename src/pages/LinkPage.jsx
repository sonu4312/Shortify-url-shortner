import { Button } from "@/components/ui/button";
import { UrlState } from "@/context/Context";
import { getClicksForUrl } from "@/db/apiClicks";
import { deleteUrl, getUrlInfo } from "@/db/apiUrl";
import useFetch from "@/hooks/useFetch";
import { Copy, Download, LinkIcon, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BarLoader, BeatLoader } from "react-spinners";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Location from "@/components/Location";
import DeviceStats from "@/components/DeviceStats";

function LinkPage() {
  const { id } = useParams();
  const { user } = UrlState();
  const navigate = useNavigate();

  const [copied, setCopied] = useState(false);

  const shortify_url = import.meta.env.VITE_SHORTIFY_URL;

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
      .writeText(`${shortify_url}/${url?.short_url}`)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
      });
  };

  const {
    loading,
    data: url,
    fn,
    error,
  } = useFetch(getUrlInfo, { id, user_id: user?.id });

  const {
    loading: loadingStats,
    data: stats,
    fn: fnStats,
  } = useFetch(getClicksForUrl, id);

  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, id);

  useEffect(() => {
    fn();
    fnStats();
  }, []);

  if (error) {
    navigate("/dashboard");
  }

  let link = "";
  if (url) {
    link = url?.custom_url ? url.custom_url : url.short_url;
  }

  return (
    <>
      {(loading || loadingStats) && (
        <BarLoader className="mb-4" width={"100%"} color="blue" />
      )}

      <div className="flex flex-col gap-8 sm:flex-row justify-between">
        <div className="flex flex-col items-start gap-8 rounded-lg sm:w-2/5">
          <span className="text-6xl font-extrabold hover:underline cursor-pointer">
            {url?.title}
          </span>
          <a
            href={`${shortify_url}/${link}`}
            target="_blank"
            className="text-2xl sm:text-3xl text-blue-400 font-bold hover:underline cursor-pointer"
          >
            {shortify_url}/{link}
          </a>

          <a
            href={url?.original_url}
            target="_blank"
            className="flex items-center gap-1 hover:underline cursor-pointer"
          >
            <LinkIcon className="p-1" />
            {url?.original_url}
          </a>
          <span className="flex itmes-end font-extralight text-sm">
            {new Date(url?.created_at).toLocaleString()}
          </span>

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
                fnDelete().then(() => navigate("/dashboard"));
              }}
            >
              {loadingDelete ? (
                <BeatLoader size={5} color="white" />
              ) : (
                <Trash />
              )}
            </Button>
          </div>
          <img
            src={url?.qr}
            alt="qr-code.png"
            className="w-4/5 sm:w-full self-center sm:self-start ring ring-blue-500 p-1 object-contain"
          />
        </div>
        {/* div for left side */}

        <Card className="sm:w-3/5">
          <CardHeader>
            <CardTitle className="text-4xl font-extrabold">Stats</CardTitle>
          </CardHeader>
          {stats && stats?.length ? (
            <CardContent className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Clicks</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{stats?.length}</p>
                </CardContent>
              </Card>
              <CardTitle>Location Data</CardTitle>
              <Location stats={stats} />
              <CardTitle>Device Info</CardTitle>
              <DeviceStats stats={stats} />
            </CardContent>
          ) : (
            <CardContent>
              {loadingStats === false
                ? "No statistics yet"
                : "Loading statistics"}
            </CardContent>
          )}
        </Card>
      </div>
    </>
  );
}

export default LinkPage;
