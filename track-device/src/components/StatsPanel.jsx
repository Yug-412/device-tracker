const StatsPanel = ({ devices }) => {
  const total = devices.length;
  const online = devices.filter((device) => device.online).length;
  const offline = total - online;

  return (
    <section className="stats-panel">
      <article>
        <h3>Total vehicles</h3>
        <p>{total}</p>
      </article>
      <article>
        <h3>Online vehicles</h3>
        <p>{online}</p>
      </article>
      <article>
        <h3>Offline vehicles</h3>
        <p>{offline}</p>
      </article>
    </section>
  );
};

export default StatsPanel;
