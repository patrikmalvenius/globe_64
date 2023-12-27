function LayerControlTabPanel(props) {
  const { children, value, index } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`globe-tabpanel-${index}`}
      aria-labelledby={`globe-tab-${index}`}
    >
      {value === index && children}
    </div>
  );
}

export default LayerControlTabPanel;
