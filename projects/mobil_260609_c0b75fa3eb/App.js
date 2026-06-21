export default function App() {
  const [active, setActive] = React.useState(false);
  const [value, setValue] = React.useState(0);
  const [history, setHistory] = React.useState([]);
  const intervalRef = React.useRef(null);

  const toggle = () => {
    setActive(!active);
    if (!active) {
      intervalRef.current = setInterval(() => {
        setValue((v) => {
          const next = v + 1;
          setHistory((h) => [...h.slice(-9), next]);
          return next;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    setActive(false);
    setValue(0);
    setHistory([]);
  };

  React.useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Su içmeyi hatırlat</Text>
      <TouchableOpacity style={[styles.circle, active && styles.active]} onPress={toggle}>
        <View style={styles.ring} />
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.sub}>{Platform.OS}</Text>
      </TouchableOpacity>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.btn, styles.btnReset]}
          onPress={reset}
        >
          <Text style={styles.btnText}>Sıfırla</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.hint}>Saatlik bildirimler: {Platform.OS}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center' },
  title: { color: '#94a3b8', marginBottom: 16, fontSize: 18 },
  circle: { position: 'relative', width: 260, height: 260, borderRadius: 130, backgroundColor: '#1e293b', justifyContent: 'center', alignItems: 'center' },
  ring: { position: 'absolute', width: 250, height: 250, borderRadius: 125, borderWidth: 8, borderColor: '#22d3ee', opacity: 0.2 },
  active: { opacity: 0.6 },
  value: { color: '#e2e8f0', fontSize: 42, fontWeight: '700', zIndex: 1 },
  sub: { color: '#94a3b8', marginTop: 4, zIndex: 1 },
  row: { flexDirection: 'row', marginTop: 24, gap: 16 },
  btn: { backgroundColor: '#22d3ee', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  btnReset: { backgroundColor: '#64748b' },
  btnText: { color: '#0f172a', fontWeight: '700' },
  hint: { marginTop: 20, color: '#475569', fontSize: 12 }
});