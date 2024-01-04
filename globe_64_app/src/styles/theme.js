const themeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: "#388E9B",
      light: "#F0F0E9",
      off: "#f6acb7",
      dark: "#423734",
    },
    secondary: {
      main: "#a6c894",
      light: "#65c3d2",
      blue: "#a6d9e1",
      dark: "#8b0055",
    },
    warning: {
      main: "#388E9B",
    },
    third: {
      main: "#388E9B",
    },
  },
  components: {
    MuiSvgIcon: {
      variants: [
        {
          props: { variant: "huge" },
          style: {
            fontSize: "5rem",
          },
        },
      ],
    },
  },
};

export { themeOptions };
