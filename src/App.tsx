import { Allotment } from "allotment";
import { BrowserSelector } from "./components/BrowserSelector";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useBrowserType } from "./store";
import { SwitchRender } from "./components/RenderUtils/SwitchRender";
import { BrowserType } from "./constant";
import { OpfsBrowser } from "./components/OpfsBrowser";
import { isOPFSSupported } from "./utils/opfs/utils";
import { OpfsBrowserProvider } from "./components/OpfsBrowser/provider";

const supportedOpfs = isOPFSSupported();

function App() {
  const [browserType] = useBrowserType();
  const [sizes, setSizes] = useLocalStorage("sizes", [1, 3]);

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
      <Allotment.Pane snap minSize={180} maxSize={280}>
        <div className="h-full bg-[#dfe1e2ea]">
          <BrowserSelector />
        </div>
      </Allotment.Pane>
      <Allotment.Pane>
        <div className="h-full ">
          <SwitchRender value={browserType}>
            <SwitchRender.Case value={BrowserType.opfs}>
              <OpfsBrowserProvider>
                <OpfsBrowser />
              </OpfsBrowserProvider>
            </SwitchRender.Case>

            <SwitchRender.Default>
              <div>Oops, 暂未支持</div>
            </SwitchRender.Default>
          </SwitchRender>
        </div>
      </Allotment.Pane>
    </Allotment>
  );
}

export default App;
