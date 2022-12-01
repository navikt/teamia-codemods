import { NextStudio } from "next-sanity/studio";

import { useEffect, useState } from "react";
import { workspaceConfig } from "../../sanity/sanity.config";

const StudioPage = () => {
  useEffect(() => {
    if (window.location.host === "aksel.nav.no") {
      window.location.replace(`http://aksel.nav.no`);
    }
  }, []);

  const [scheme, setScheme] = useState("light");

  return (
    <div data-theme={scheme} className="min-h-screen">
      <NextStudio
        config={workspaceConfig}
        scheme={scheme}
        onSchemeChange={(s) => setScheme(s)}
      />
    </div>
  );
};

export default StudioPage;
