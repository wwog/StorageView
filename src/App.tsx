import { Allotment } from "allotment";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { OpfsBrowser } from "./components/OpfsBrowser";
import { isOPFSSupported } from "./utils/opfs/utils";
import { OpfsBrowserProvider } from "./components/OpfsBrowser/provider";
import { ApplicationContainer } from "./components/ApplicationContainer";
import { ApplicationManager } from "./store/applications";
import { textViewerApp } from "./applications/text-viewer";
import { useEffect } from "react";
import { useApplications } from "./store/applications";

const supportedOpfs = isOPFSSupported();

function App() {
  const [sizes, setSizes] = useLocalStorage("sizes", [2, 2.5]);
  const [, setApplications] = useApplications();

  useEffect(() => {
    // 注册应用
    const appManager = ApplicationManager.getInstance();
    // 设置更新函数
    appManager.setUpdateFunction(setApplications);
    appManager.registerApplication(textViewerApp);
  }, [setApplications]);

  if (supportedOpfs === false) {
    return <div>Opfs,Not Support Opfs!</div>;
  }

  return (
    <Allotment
      separator
      defaultSizes={sizes}
      onChange={(sizes) => {
        setSizes(sizes, true);
      }}
    >
      <Allotment.Pane snap minSize={300} maxSize={720} preferredSize={410}>
        <div className="h-full bg-[#dfe1e2ea]">
          <OpfsBrowserProvider>
            <OpfsBrowser />
          </OpfsBrowserProvider>
        </div>
      </Allotment.Pane>
      <Allotment.Pane>
        <ApplicationContainer />
      </Allotment.Pane>
    </Allotment>
  );
}

export default App;
