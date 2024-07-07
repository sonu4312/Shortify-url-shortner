import { storeClicks } from "@/db/apiClicks";
import { getLongUrl } from "@/db/apiUrl";
import useFetch from "@/hooks/useFetch";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";

function RedirectLink() {
  const { id } = useParams();

  const { loading, data, fn } = useFetch(getLongUrl, id);

  const { loading: loadingStats, fn: fnStats } = useFetch(storeClicks, {
    id: data?.id,
    original_url: data?.original_url,
  });

  useEffect(() => {
    fn();
  }, []);

  useEffect(() => {
    if (!loading && data) {
      fnStats();
    }
  }, [loading]);

  if (loading || loadingStats) {
    return (
      <>
        <BarLoader width={"100%"} color="blue" />
        <br />
        Redirecting...
      </>
    );
  }
}

export default RedirectLink;
