import React, { useMemo, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import { useTheme } from "./contexts/ThemeContext";

const SHOTS = {
  privacy: require("../assets/help/privacy.png"),
  login: require("../assets/help/login.png"),
  register: require("../assets/help/register.png"),
  home: require("../assets/help/home-weather.png"),
  incident: require("../assets/help/incident-report.png"),
  earthquake: require("../assets/help/earthquake-map.png"),
  flood: require("../assets/help/flood-map.png"),
  barangay: require("../assets/help/barangay-map.png"),
  evacuation: require("../assets/help/evacuation-map.png"),
  evacuationDetails: require("../assets/help/evacuation-details.png"),
  navigation: require("../assets/help/navigation.png"),
  safety: require("../assets/help/safety-groups.png"),
  guidelines: require("../assets/help/guidelines.png"),
  twin: require("../assets/help/digital-twin.png"),
  settings: require("../assets/help/settings.png"),
  security: require("../assets/help/password-security.png"),
};

const GUIDES = [
  {
    id: "getting-started",
    icon: "rocket-outline",
    title: "Getting started",
    description: "Create an account, review privacy terms, and sign in.",
    image: SHOTS.login,
    images: [SHOTS.privacy, SHOTS.register, SHOTS.login],
    steps: [
      "Open SagipBayan and choose Register if you do not have an account.",
      "Enter accurate personal and contact information, then review the Data Privacy Policy.",
      "Verify your account when prompted and sign in using your registered email and password.",
      "Allow only the permissions you are comfortable sharing. Location is needed for map-based safety tools.",
    ],
    tip: "Never share your password or one-time verification code with another person.",
  },
  {
    id: "home",
    icon: "map-outline",
    title: "Home map, search & weather",
    description: "Understand the main map, local weather, search, and notifications.",
    image: SHOTS.home,
    steps: [
      "Use the bottom navigation or Home option to return to the main map.",
      "Search for a place using the bar at the top of the map.",
      "Check the weather card for current local conditions before travelling.",
      "Tap the bell to review official alerts, group activity, and status updates.",
    ],
    tip: "Map and weather information can be delayed by weak internet or unavailable location services.",
  },
  {
    id: "incident",
    icon: "warning-outline",
    title: "Incident reporting",
    description: "Send a location-based incident report to the responders.",
    image: SHOTS.incident,
    steps: [
      "Open Incident Tagging from the menu or map controls.",
      "Select the incident type and place the marker at the correct location.",
      "Add a clear description and supporting photo when it is safe to do so.",
      "Review the details, submit once, and wait for the report status to update.",
    ],
    tip: "For an immediate life-threatening emergency, contact emergency services first. Do not put yourself at risk to take a photo.",
  },
  {
    id: "hazards",
    icon: "layers-outline",
    title: "Hazard & barangay maps",
    description: "View flood, earthquake, and barangay information layers.",
    image: SHOTS.flood,
    images: [SHOTS.flood, SHOTS.earthquake, SHOTS.barangay],
    steps: [
      "Open Hazard Map and select the layer you want to inspect.",
      "Use Flood Map for flood-prone areas and Earthquake Map for earthquake-related information.",
      "Use Barangay Map to understand municipal and barangay boundaries.",
      "Zoom and pan to inspect your area, then follow current official advisories.",
    ],
    tip: "Hazard layers support preparedness; they do not replace real-time instructions from the MDRRMO.",
  },
  {
    id: "evacuation",
    icon: "navigate-circle-outline",
    title: "Evacuation centers & navigation",
    description: "Find center details and start a safer route.",
    image: SHOTS.evacuation,
    images: [SHOTS.evacuation, SHOTS.evacuationDetails, SHOTS.navigation],
    steps: [
      "Open Evacuation Places from the map controls.",
      "Choose a marker or list entry to see the center name, status, and available information.",
      "Tap the navigation action and select the available travel mode.",
      "Follow the route while staying alert to road closures and responder instructions.",
    ],
    tip: "Confirm that a center is open before travelling. Conditions and capacity may change quickly.",
  },
  {
    id: "safety",
    icon: "shield-checkmark-outline",
    title: "Safety Marking & groups",
    description: "Create or join groups, share status, and view the selected group.",
    image: SHOTS.safety,
    steps: [
      "Open Safety Marking and create a named group or join one using its group code.",
      "Select the active group from the group selector. The map shows members of that selected group only.",
      "Update your safety status and location sharing preference when conditions change.",
      "Group owners can rename the group, remove members, transfer ownership, or delete it after confirmation.",
      "Members may leave a group. Ownership actions require the current owner's confirmation.",
    ],
    tip: "Share a group code privately. A crown icon identifies the current owner and moves when ownership is transferred.",
  },
  {
    id: "donations",
    icon: "heart-outline",
    title: "Donations",
    description: "Submit a donation and monitor its validation status.",
    steps: [
      "Open Donate from the main menu.",
      "Choose the donation type and provide the requested details accurately.",
      "Attach valid proof only when requested, then review before submitting.",
      "Use Donation History to monitor whether the submission is pending, accepted, or declined.",
    ],
    tip: "Donation screenshots are intentionally omitted here to protect contact and transaction information.",
  },
  {
    id: "announcements",
    icon: "megaphone-outline",
    title: "Announcements",
    description: "Read public MDRRMO notices and operational updates.",
    steps: [
      "Open Announcements from the menu or tap a related notification.",
      "Read the full notice, including its publication date and any instructions.",
      "Refresh the page if a newly received announcement is not yet visible.",
    ],
    tip: "Use only notices published through official SagipBayan or MDRRMO channels.",
  },
  {
    id: "guidelines",
    icon: "reader-outline",
    title: "Safety guidelines",
    description: "Review preparedness and response instructions by hazard.",
    image: SHOTS.guidelines,
    steps: [
      "Open Guidelines from the main menu.",
      "Choose the relevant hazard or preparedness topic.",
      "Read the steps before an emergency and revisit them when an advisory is issued.",
      "Tap a guideline notification to open the related guidance directly.",
    ],
    tip: "Save critical emergency numbers outside the app as an additional precaution.",
  },
  {
    id: "digital-twin",
    icon: "water-outline",
    title: "Digital Twin",
    description: "View the water-level model and its available controls.",
    image: SHOTS.twin,
    steps: [
      "Open Digital Twin from the main menu.",
      "Wait for the interactive model to finish loading.",
      "Use the on-screen controls to inspect available water-level information.",
      "Return to the app menu when you are finished.",
    ],
    tip: "This feature requires internet access and may load slowly on limited connections.",
  },
  {
    id: "virtual-twin",
    icon: "cube-outline",
    title: "Virtual Twin",
    description: "Explore the interactive flood environment and change locations.",
    steps: [
      "Open Virtual Twin from the main menu and allow the scene to load.",
      "Use the location or place control to move between available areas.",
      "Use the scene controls to inspect the environment from different views.",
      "Treat the visualization as a planning aid and follow official live alerts.",
    ],
    tip: "Performance depends on your device and connection. Close other heavy apps if the scene becomes slow.",
  },
  {
    id: "account",
    icon: "person-circle-outline",
    title: "Account & personal details",
    description: "Review your profile and keep emergency information accurate.",
    steps: [
      "Open the menu, tap your profile card, then select Personal Details.",
      "Review your name, contact details, and other resident information.",
      "Edit only the fields that need updating and save your changes.",
      "Return to Profile to confirm the updated information.",
    ],
    tip: "Personal account screenshots are omitted from this manual to protect resident information.",
  },
  {
    id: "settings",
    icon: "settings-outline",
    title: "Settings & privacy",
    description: "Control appearance, notification sounds, and location sharing.",
    image: SHOTS.settings,
    steps: [
      "Open Profile, then select Settings.",
      "Choose Light, Dark, or System appearance.",
      "Adjust normal, danger, and SMS notification sounds as needed.",
      "Review the consent notice before enabling Safety Marking location sharing.",
    ],
    tip: "Disabling location sharing can prevent other group members from seeing your latest position.",
  },
  {
    id: "security",
    icon: "lock-closed-outline",
    title: "Password & security",
    description: "Change your password and protect access to your account.",
    image: SHOTS.security,
    steps: [
      "Open Profile and select Password & Security.",
      "Enter your current password, then create and confirm a strong new password.",
      "Complete verification if the app requests a one-time code.",
      "Sign in again if your session is ended after the change.",
    ],
    tip: "Use a unique password and never approve a verification request you did not initiate.",
  },
];

const FAQS = [
  ["Why can’t I see a group member on the map?", "Confirm that the correct group is selected and that the member enabled Safety Marking location sharing. Their device also needs location permission and a connection."],
  ["Why did the members change when I selected another group?", "The map is scoped to the active group. Switching groups intentionally replaces the visible markers with members of the newly selected group."],
  ["Where can I find the group code?", "Open Safety Marking, select the group, and open its group details. Keep the displayed code private and share it only with people you trust."],
  ["Why is a report still pending?", "Incident and donation submissions may require review. Avoid submitting duplicates; refresh later and monitor notifications for a status change."],
  ["Why is navigation unavailable?", "Check location permission and internet access, then choose the evacuation center again. A route may also be unavailable when the map service cannot find a safe path."],
  ["Why am I not receiving alerts?", "Check notification permission, the app's sound settings, your connection, and your device's Focus or Do Not Disturb mode."],
  ["Why won’t Digital Twin or Virtual Twin load?", "These interactive modules need internet access and more device resources than ordinary pages. Retry on a stable connection and close other heavy apps."],
  ["Can I use this manual without internet?", "Yes. The written guides and included screenshots are stored in the app. Live maps, reports, twins, weather, and current announcements still require a connection."],
];

export default function HelpCenter({ navigation }) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("guides");
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  const normalizedQuery = query.trim().toLowerCase();
  const guides = useMemo(() => {
    if (!normalizedQuery) return GUIDES;
    return GUIDES.filter((guide) =>
      [guide.title, guide.description, ...(guide.steps || [])]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [normalizedQuery]);
  const faqs = useMemo(() => {
    if (!normalizedQuery) return FAQS;
    return FAQS.filter((faq) => faq.join(" ").toLowerCase().includes(normalizedQuery));
  }, [normalizedQuery]);

  if (selectedGuide) {
    const screenshots = selectedGuide.images || (selectedGuide.image ? [selectedGuide.image] : []);
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <Header
          title={selectedGuide.title}
          theme={theme}
          styles={styles}
          onBack={() => setSelectedGuide(null)}
        />
        <ScrollView contentContainerStyle={styles.detailContent} showsVerticalScrollIndicator={false}>
          <View style={styles.detailHero}>
            <View style={styles.detailIcon}>
              <Ionicons name={selectedGuide.icon} size={27} color={theme.primary} />
            </View>
            <Text style={styles.detailTitle}>{selectedGuide.title}</Text>
            <Text style={styles.detailDescription}>{selectedGuide.description}</Text>
          </View>

          {screenshots.length > 0 && (
            <View style={styles.galleryCard}>
              <View style={styles.galleryHeading}>
                <Ionicons name="images-outline" size={18} color={theme.primary} />
                <Text style={styles.galleryTitle}>From the SagipBayan manual</Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.galleryRow}>
                {screenshots.map((source, index) => (
                  <View style={styles.phoneFrame} key={`${selectedGuide.id}-${index}`}>
                    <Image source={source} style={styles.guideImage} resizeMode="contain" />
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          <View style={styles.stepsCard}>
            <Text style={styles.blockTitle}>How to use it</Text>
            {selectedGuide.steps.map((step, index) => (
              <View key={step} style={styles.stepRow}>
                <View style={styles.stepNumber}><Text style={styles.stepNumberText}>{index + 1}</Text></View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>

          <View style={styles.tipCard}>
            <Ionicons name="information-circle" size={22} color={theme.primary} />
            <View style={styles.tipCopy}>
              <Text style={styles.tipTitle}>Good to know</Text>
              <Text style={styles.tipText}>{selectedGuide.tip}</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <Header title="Help Center" theme={theme} styles={styles} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <LinearGradient
          colors={["#86EFAC", "#16A34A", "#065F46"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.heroGlow} />
          <View style={styles.heroBadge}><Ionicons name="shield-checkmark" size={18} color="#FFFFFF" /></View>
          <Text style={styles.heroEyebrow}>SAGIPBAYAN USER MANUAL</Text>
          <Text style={styles.heroTitle}>How can we help?</Text>
          <Text style={styles.heroText}>Simple, visual guides for every resident feature.</Text>
          <View style={styles.offlinePill}>
            <Ionicons name="cloud-offline-outline" size={15} color="#FFFFFF" />
            <Text style={styles.offlineText}>Guides available offline</Text>
          </View>
        </LinearGradient>

        <View style={styles.searchWrap}>
          <Ionicons name="search-outline" size={20} color={theme.subtext} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search features or questions"
            placeholderTextColor={theme.subtext}
            style={styles.searchInput}
            returnKeyType="search"
          />
          {!!query && (
            <TouchableOpacity onPress={() => setQuery("")} hitSlop={10}>
              <Ionicons name="close-circle" size={20} color={theme.subtext} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.tabs}>
          {[{ id: "guides", label: "Feature guides", icon: "book-outline" }, { id: "faqs", label: "FAQs", icon: "help-circle-outline" }].map((item) => (
            <TouchableOpacity key={item.id} style={[styles.tab, tab === item.id && styles.tabActive]} onPress={() => setTab(item.id)}>
              <Ionicons name={item.icon} size={18} color={tab === item.id ? theme.primary : theme.subtext} />
              <Text style={[styles.tabText, tab === item.id && styles.tabTextActive]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {tab === "guides" ? (
          <View>
            <View style={styles.sectionHeading}>
              <Text style={styles.sectionTitle}>Explore every feature</Text>
              <Text style={styles.resultText}>{guides.length} guides</Text>
            </View>
            {guides.map((guide) => (
              <TouchableOpacity key={guide.id} style={styles.guideCard} activeOpacity={0.86} onPress={() => setSelectedGuide(guide)}>
                <View style={styles.cardIcon}><Ionicons name={guide.icon} size={23} color={theme.primary} /></View>
                <View style={styles.cardCopy}>
                  <Text style={styles.cardTitle}>{guide.title}</Text>
                  <Text style={styles.cardDescription} numberOfLines={2}>{guide.description}</Text>
                  <View style={styles.cardMeta}>
                    <Text style={styles.cardMetaText}>{guide.steps.length} steps</Text>
                    {guide.image && <><View style={styles.metaDot} /><Text style={styles.cardMetaText}>Visual guide</Text></>}
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.subtext} />
              </TouchableOpacity>
            ))}
            {guides.length === 0 && <EmptyState styles={styles} />}
          </View>
        ) : (
          <View>
            <View style={styles.sectionHeading}>
              <Text style={styles.sectionTitle}>Frequently asked questions</Text>
              <Text style={styles.resultText}>{faqs.length} answers</Text>
            </View>
            {faqs.map(([question, answer], index) => {
              const isOpen = openFaq === question;
              return (
                <TouchableOpacity key={question} style={styles.faqCard} activeOpacity={0.88} onPress={() => setOpenFaq(isOpen ? null : question)}>
                  <View style={styles.faqQuestionRow}>
                    <View style={styles.faqNumber}><Text style={styles.faqNumberText}>{index + 1}</Text></View>
                    <Text style={styles.faqQuestion}>{question}</Text>
                    <Ionicons name={isOpen ? "chevron-up" : "chevron-down"} size={19} color={theme.primary} />
                  </View>
                  {isOpen && <Text style={styles.faqAnswer}>{answer}</Text>}
                </TouchableOpacity>
              );
            })}
            {faqs.length === 0 && <EmptyState styles={styles} />}
          </View>
        )}

        <View style={styles.emergencyCard}>
          <Ionicons name="alert-circle-outline" size={24} color="#B45309" />
          <View style={styles.emergencyCopy}>
            <Text style={styles.emergencyTitle}>During an emergency</Text>
            <Text style={styles.emergencyText}>Follow current MDRRMO and responder instructions. SagipBayan is a support tool and does not replace emergency services.</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function Header({ title, onBack, theme, styles }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.headerButton} onPress={onBack} activeOpacity={0.8}>
        <Ionicons name="arrow-back" size={21} color={theme.text} />
      </TouchableOpacity>
      <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
      <View style={styles.headerMark}><Ionicons name="help-buoy-outline" size={20} color={theme.primary} /></View>
    </View>
  );
}

function EmptyState({ styles }) {
  return (
    <View style={styles.emptyState}>
      <Ionicons name="search-outline" size={30} color="#7A8A80" />
      <Text style={styles.emptyTitle}>No matching help found</Text>
      <Text style={styles.emptyText}>Try a feature name such as “groups,” “map,” or “password.”</Text>
    </View>
  );
}

function createStyles(theme) {
  const primary = theme.primary || "#0A9F55";
  const primarySoft = theme.primarySoft || "#E8F7EF";
  const surface = theme.card || theme.surface || "#FFFFFF";
  const background = theme.background || "#F4F8F5";
  const border = theme.border || "#DDE8E1";
  const text = theme.text || "#102A1D";
  const subtext = theme.subtext || "#68776E";

  return StyleSheet.create({
    root: { flex: 1, backgroundColor: background },
    header: { height: 64, paddingHorizontal: 18, flexDirection: "row", alignItems: "center", borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: border, backgroundColor: surface },
    headerButton: { width: 40, height: 40, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: primarySoft },
    headerTitle: { flex: 1, marginHorizontal: 13, color: text, fontSize: 19, fontWeight: "800" },
    headerMark: { width: 40, height: 40, borderRadius: 14, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: border },
    content: { padding: 16, paddingBottom: 44 },
    hero: { minHeight: 206, overflow: "hidden", padding: 22, borderRadius: 26, marginBottom: 14 },
    heroGlow: { position: "absolute", width: 190, height: 190, borderRadius: 95, backgroundColor: "rgba(70, 211, 129, 0.26)", right: -52, top: -52 },
    heroBadge: { width: 38, height: 38, borderRadius: 13, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.17)", marginBottom: 16 },
    heroEyebrow: { color: "#BDEDD0", fontSize: 11, fontWeight: "900", letterSpacing: 1.4, marginBottom: 6 },
    heroTitle: { color: "#FFFFFF", fontSize: 28, lineHeight: 34, fontWeight: "900" },
    heroText: { color: "#E0F6E8", fontSize: 14, lineHeight: 21, marginTop: 6, maxWidth: 260 },
    offlinePill: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 7, backgroundColor: "rgba(0,0,0,0.16)", borderRadius: 20, paddingHorizontal: 11, paddingVertical: 7, marginTop: 15 },
    offlineText: { color: "#FFFFFF", fontSize: 11, fontWeight: "800" },
    searchWrap: { height: 54, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 17, borderWidth: 1, borderColor: border, backgroundColor: surface, marginBottom: 12 },
    searchInput: { flex: 1, color: text, fontSize: 14, paddingVertical: 0 },
    tabs: { flexDirection: "row", padding: 4, borderRadius: 16, backgroundColor: theme.surfaceAlt || primarySoft, marginBottom: 21 },
    tab: { flex: 1, minHeight: 42, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, borderRadius: 13 },
    tabActive: { backgroundColor: surface, shadowColor: "#0B3B23", shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2 },
    tabText: { color: subtext, fontSize: 13, fontWeight: "700" },
    tabTextActive: { color: primary },
    sectionHeading: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 11, paddingHorizontal: 2 },
    sectionTitle: { color: text, fontSize: 17, fontWeight: "900", flex: 1 },
    resultText: { color: subtext, fontSize: 11, fontWeight: "700", marginLeft: 10 },
    guideCard: { flexDirection: "row", alignItems: "center", padding: 14, minHeight: 112, borderRadius: 20, borderWidth: 1, borderColor: border, backgroundColor: surface, marginBottom: 10 },
    cardIcon: { width: 48, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: primarySoft, marginRight: 13 },
    cardCopy: { flex: 1, paddingRight: 8 },
    cardTitle: { color: text, fontSize: 15, fontWeight: "900", marginBottom: 4 },
    cardDescription: { color: subtext, fontSize: 12, lineHeight: 18 },
    cardMeta: { flexDirection: "row", alignItems: "center", marginTop: 8 },
    cardMetaText: { color: primary, fontSize: 10, fontWeight: "800" },
    metaDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: primary, marginHorizontal: 7 },
    faqCard: { padding: 16, borderRadius: 18, borderWidth: 1, borderColor: border, backgroundColor: surface, marginBottom: 10 },
    faqQuestionRow: { flexDirection: "row", alignItems: "center" },
    faqNumber: { width: 30, height: 30, borderRadius: 10, alignItems: "center", justifyContent: "center", backgroundColor: primarySoft, marginRight: 11 },
    faqNumberText: { color: primary, fontWeight: "900", fontSize: 11 },
    faqQuestion: { flex: 1, color: text, fontWeight: "800", fontSize: 13, lineHeight: 19, paddingRight: 8 },
    faqAnswer: { color: subtext, fontSize: 13, lineHeight: 20, marginTop: 13, paddingTop: 13, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: border },
    emergencyCard: { flexDirection: "row", gap: 12, padding: 16, borderRadius: 18, backgroundColor: "#FFF7E8", borderWidth: 1, borderColor: "#F5D9A2", marginTop: 14 },
    emergencyCopy: { flex: 1 },
    emergencyTitle: { color: "#8A4B08", fontWeight: "900", fontSize: 13, marginBottom: 4 },
    emergencyText: { color: "#8A5C26", fontSize: 11, lineHeight: 17 },
    detailContent: { padding: 16, paddingBottom: 44 },
    detailHero: { alignItems: "center", padding: 22, borderRadius: 24, backgroundColor: primarySoft, marginBottom: 13 },
    detailIcon: { width: 56, height: 56, borderRadius: 19, alignItems: "center", justifyContent: "center", backgroundColor: surface, marginBottom: 13 },
    detailTitle: { color: text, fontSize: 23, lineHeight: 29, fontWeight: "900", textAlign: "center" },
    detailDescription: { color: subtext, fontSize: 13, lineHeight: 20, textAlign: "center", marginTop: 7 },
    galleryCard: { padding: 14, borderRadius: 21, backgroundColor: surface, borderWidth: 1, borderColor: border, marginBottom: 13 },
    galleryHeading: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
    galleryTitle: { color: text, fontSize: 13, fontWeight: "900" },
    galleryRow: { gap: 11, paddingRight: 2 },
    phoneFrame: { width: 230, height: 410, padding: 5, borderRadius: 18, backgroundColor: "#111A15", overflow: "hidden" },
    guideImage: { width: "100%", height: "100%", borderRadius: 14, backgroundColor: "#FFFFFF" },
    stepsCard: { padding: 18, borderRadius: 21, backgroundColor: surface, borderWidth: 1, borderColor: border, marginBottom: 13 },
    blockTitle: { color: text, fontSize: 17, fontWeight: "900", marginBottom: 15 },
    stepRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 15 },
    stepNumber: { width: 28, height: 28, borderRadius: 10, alignItems: "center", justifyContent: "center", backgroundColor: primary, marginRight: 12 },
    stepNumberText: { color: "#FFFFFF", fontSize: 11, fontWeight: "900" },
    stepText: { flex: 1, color: text, fontSize: 13, lineHeight: 20, paddingTop: 3 },
    tipCard: { flexDirection: "row", alignItems: "flex-start", gap: 11, padding: 16, borderRadius: 18, backgroundColor: primarySoft },
    tipCopy: { flex: 1 },
    tipTitle: { color: text, fontSize: 13, fontWeight: "900", marginBottom: 4 },
    tipText: { color: subtext, fontSize: 12, lineHeight: 18 },
    emptyState: { alignItems: "center", padding: 30, borderRadius: 20, borderWidth: 1, borderStyle: "dashed", borderColor: border, backgroundColor: surface },
    emptyTitle: { color: text, fontSize: 14, fontWeight: "900", marginTop: 10 },
    emptyText: { color: subtext, fontSize: 12, lineHeight: 18, textAlign: "center", marginTop: 5 },
  });
}
