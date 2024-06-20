module.exports = {
  head: [
    [
      "link", // 设置 favicon.ico，注意图片放在 public 文件夹下
      { rel: "icon", href: "ts.svg" },
    ],
  ],
  base: "/vhooks-ts/",
  title: "vhooks-ts",
  description: "Vue hook library, ready to use, written in Typescript.",
  // head: ["link", { rel: "icon", href: "/logo.png" }],
  markdown: {
    lineNumbers: false,
  },
  lastUpdated: "Last Updated",
  themeConfig: {
    logo: "/logo.svg",
    // nav: [
    //   { text: "Documentation", link: "/introduction" },
    //   { text: "Hooks", link: "/hooks/useBoolean" },
    // ],
    // sidebar: [{

    // }]
    sidebar: {
      "/hooks": [
        {
          title: "Getting Started",
          children: [
            {
              title: "Introduction",
              path: "/hooks/introduction",
            },
          ],
        },
        {
          title: "Hooks",
          children: [
            {
              title: "useBoolean",
              path: "/hooks/useBoolean",
            },
            {
              title: "useClickAnyWhere",
              path: "/hooks/useClickAnyWhere",
            },
            {
              title: "useCopyToClipboard",
              path: "/hooks/useCopyToClipboard",
            },
            {
              title: "useCountdown",
              path: "/hooks/useCountdown",
            },
            {
              title: "useCounter",
              path: "/hooks/useCounter",
            },
            {
              title: "useDarkMode",
              path: "/hooks/useDarkMode",
            },
            {
              title: "useDebounce",
              path: "/hooks/useDebounce",
            },
            {
              title: "useDocumentTitle",
              path: "/hooks/useDocumentTitle",
            },
            {
              title: "useElementSize",
              path: "/hooks/useElementSize",
            },
            {
              title: "useEventListener",
              path: "/hooks/useEventListener",
            },
            {
              title: "useFetch",
              path: "/hooks/useFetch",
            },
            {
              title: "useHover",
              path: "/hooks/useHover",
            },
            {
              title: "useImageOnLoad",
              path: "/hooks/useImageOnLoad",
            },
            {
              title: "useIntersectionObserver",
              path: "/hooks/useIntersectionObserver",
            },
            {
              title: "useInterval",
              path: "/hooks/useInterval",
            },
            {
              title: "useFetch",
              path: "/hooks/useFetch",
            },
            {
              title: "useIsFirstRender",
              path: "/hooks/useIsFirstRender",
            },
            {
              title: "useIsMounted",
              path: "/hooks/useIsMounted",
            },
            {
              title: "useLocalStorage",
              path: "/hooks/useLocalStorage",
            },
            {
              title: "useLockedBody",
              path: "/hooks/useLockedBody",
            },
            {
              title: "useMap",
              path: "/hooks/useMap",
            },
            {
              title: "useMediaQuery",
              path: "/hooks/useMediaQuery",
            },
            {
              title: "useOnClickOutside",
              path: "/hooks/useOnClickOutside",
            },
            {
              title: "useScreen",
              path: "/hooks/useScreen",
            },
            {
              title: "useScript",
              path: "/hooks/useScript",
            },
            {
              title: "useStep",
              path: "/hooks/useStep",
            },
            {
              title: "useTernaryDarkMode",
              path: "/hooks/useTernaryDarkMode",
            },
            {
              title: "useToggle",
              path: "/hooks/useToggle",
            },
            {
              title: "useUpdateEffect",
              path: "/hooks/useUpdateEffect",
            },
            {
              title: "useWindowSize",
              path: "/hooks/useWindowSize",
            },
          ],
        },
      ],
    },
  },
};
