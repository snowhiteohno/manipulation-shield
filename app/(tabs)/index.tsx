import { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function AnalyzeScreen() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | {
    tactic_name: string;
    risk_level: string;
    explanation: string;
    psychology: string;
    flagged_phrases: { phrase: string; reason: string }[];
    recommended_action: string;
  }>(null);
  const [error, setError] = useState('');

  const riskColor = {
    low: '#3DDC84',
    suspicious: '#F5A623',
    high: '#E5534B',
  };

  async function analyze() {
    if (message.trim().length < 10) return;
    setLoading(true);
    setError('');
    setResult(null);

    const apiKey = process.env.EXPO_PUBLIC_GEMINI_KEY;
    if (!apiKey) {
      setError('Missing API key. Set EXPO_PUBLIC_GEMINI_KEY and restart the app.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: {
              parts: [{
                text: `You are a manipulation tactic classifier. Analyze the message and return ONLY valid JSON with this exact structure:
{
  "tactic_name": string,
  "risk_level": "low" or "suspicious" or "high",
  "explanation": string (2-3 sentences plain language),
  "psychology": string (1 sentence why it works on humans),
  "flagged_phrases": [{"phrase": string, "reason": string}],
  "recommended_action": "Safe to ignore" or "Verify through official channel" or "Do not respond or click"
}
Never add text outside the JSON.`
              }]
            },
            contents: [{ parts: [{ text: message }] }],
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 1024,
              responseMimeType: 'application/json',
            },
          }),
        }
      );

      const data = await response.json();
      console.log('API response:', JSON.stringify(data));

      if (!response.ok) {
        throw new Error(data?.error?.message ?? `Request failed (${response.status})`);
      }
      if (data.promptFeedback?.blockReason) {
        setError('This message was blocked by the safety filter and could not be analyzed.');
        return;
      }

      const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!raw) {
        setError('No analysis was returned. Try rephrasing the message.');
        return;
      }

      const parsed = JSON.parse(raw);
      setResult(parsed);
    } catch (e) {
      console.log('Error:', e);
      setError('Analysis failed. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  const color = result ? riskColor[result.risk_level as keyof typeof riskColor] ?? '#8B91B0' : '#8B91B0';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Manipulation Shield</Text>
      <Text style={styles.subtitle}>Paste any suspicious message below</Text>

      <TextInput
        style={styles.input}
        multiline
        placeholder="Paste a WhatsApp, SMS, or email message..."
        placeholderTextColor="#4A4F6A"
        value={message}
        onChangeText={setMessage}
        maxLength={2000}
      />
      <Text style={styles.charCount}>{message.length} / 2000</Text>

      <TouchableOpacity
        style={[styles.button, (message.trim().length < 10 || loading) && styles.buttonDisabled]}
        onPress={analyze}
        disabled={message.trim().length < 10 || loading}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.buttonText}>Analyze Message</Text>
        }
      </TouchableOpacity>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {result && (
        <View style={styles.resultCard}>
          <View style={[styles.riskBadge, { borderColor: color, backgroundColor: color + '26' }]}>
            <Text style={[styles.riskText, { color }]}>{result.risk_level.toUpperCase()}</Text>
          </View>

          <Text style={styles.tacticName}>{result.tactic_name}</Text>

          <Text style={styles.sectionLabel}>WHAT'S HAPPENING</Text>
          <Text style={styles.bodyText}>{result.explanation}</Text>

          <Text style={styles.sectionLabel}>WHY IT WORKS</Text>
          <Text style={styles.bodyText}>{result.psychology}</Text>

          {result.flagged_phrases.length > 0 && (
            <>
              <Text style={styles.sectionLabel}>FLAGGED PHRASES</Text>
              {result.flagged_phrases.map((p, i) => (
                <View key={i} style={styles.phraseCard}>
                  <Text style={styles.phrase}>"{p.phrase}"</Text>
                  <Text style={styles.phraseReason}>{p.reason}</Text>
                </View>
              ))}
            </>
          )}

          <Text style={styles.sectionLabel}>WHAT TO DO</Text>
          <View style={[styles.actionBanner, { borderLeftColor: color }]}>
            <Text style={styles.actionText}>{result.recommended_action}</Text>
          </View>

          <Text style={styles.privacy}>🔒 Text sent to Google Gemini for analysis. Not stored by this app.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F1117' },
  content: { padding: 20, paddingTop: 60 },
  title: { color: '#F0F2FF', fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { color: '#8B91B0', fontSize: 14, marginBottom: 20 },
  input: {
    backgroundColor: '#1C1F2E',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2A2D3E',
    color: '#F0F2FF',
    fontSize: 15,
    padding: 14,
    minHeight: 140,
    textAlignVertical: 'top',
  },
  charCount: { color: '#4A4F6A', fontSize: 12, textAlign: 'right', marginTop: 4 },
  button: {
    backgroundColor: '#5B6EF5',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  error: { color: '#E5534B', marginTop: 12, textAlign: 'center' },
  resultCard: {
    backgroundColor: '#1C1F2E',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
  },
  riskBadge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 12,
  },
  riskText: { fontSize: 13, fontWeight: 'bold' },
  tacticName: { color: '#F0F2FF', fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  sectionLabel: {
    color: '#4A4F6A',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    marginTop: 16,
    marginBottom: 6,
  },
  bodyText: { color: '#8B91B0', fontSize: 14, lineHeight: 22 },
  phraseCard: {
    backgroundColor: '#0F1117',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  phrase: { color: '#F5A623', fontSize: 14, fontWeight: '600', marginBottom: 4 },
  phraseReason: { color: '#8B91B0', fontSize: 13 },
  actionBanner: {
    borderLeftWidth: 4,
    backgroundColor: '#0F1117',
    borderRadius: 8,
    padding: 12,
    marginTop: 6,
  },
  actionText: { color: '#F0F2FF', fontSize: 15, fontWeight: '500' },
  privacy: { color: '#4A4F6A', fontSize: 12, marginTop: 16, textAlign: 'center' },
});