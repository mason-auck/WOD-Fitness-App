import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Layout } from "@/constants/theme";
import { useAppStyles } from "@/hooks/use-app-styles";

const CURRENT_USER = "Jasmin";

type FeedComment = {
  id: string;
  author: string;
  text: string;
  postedAt: string;
};

type FeedEntry = {
  id: string;
  author: string;
  wodTitle: string;
  wodType: string;
  score: string;
  notes?: string;
  caption?: string;
  postedAt: string;
  likes: number;
  likedByMe: boolean;
  comments: FeedComment[];
  visibility: "public" | "gym";
};

const INITIAL_ENTRIES: FeedEntry[] = [
  {
    id: "1",
    author: "Jasmin",
    wodTitle: "Fran",
    wodType: "For Time",
    score: "4:32",
    caption: "Finally sub-5! Thrusters felt heavy today.",
    postedAt: "2h ago",
    likes: 12,
    likedByMe: true,
    visibility: "gym",
    comments: [
      {
        id: "c1",
        author: "Mike T.",
        text: "Huge PR — nice work!",
        postedAt: "1h ago",
      },
      {
        id: "c2",
        author: "Sarah K.",
        text: "Beast mode 🔥",
        postedAt: "45m ago",
      },
    ],
  },
  {
    id: "2",
    author: "Mike T.",
    wodTitle: "1RM Back Squat",
    wodType: "Weight",
    score: "315 lbs",
    notes: "Felt solid, maybe 320 next time.",
    postedAt: "4h ago",
    likes: 8,
    likedByMe: false,
    visibility: "gym",
    comments: [
      {
        id: "c3",
        author: "Coach Dan",
        text: "Depth looked great on every rep.",
        postedAt: "3h ago",
      },
    ],
  },
  {
    id: "3",
    author: "Sarah K.",
    wodTitle: "Cindy",
    wodType: "AMRAP",
    score: "19 rounds + 7",
    caption: "Arms were on fire by round 12.",
    postedAt: "Yesterday",
    likes: 15,
    likedByMe: false,
    visibility: "public",
    comments: [],
  },
  {
    id: "4",
    author: "Coach Dan",
    wodTitle: "Murph",
    wodType: "For Time",
    score: "38:44 (vest)",
    notes: "Partitioned 20 rounds of Cindy-style. Hot out there.",
    postedAt: "Yesterday",
    likes: 24,
    likedByMe: true,
    visibility: "public",
    comments: [
      {
        id: "c4",
        author: "Jasmin",
        text: "Inspiring — need to tackle this again soon.",
        postedAt: "Yesterday",
      },
    ],
  },
  {
    id: "5",
    author: "Alex R.",
    wodTitle: "Grace",
    wodType: "For Time",
    score: "3:58",
    postedAt: "2 days ago",
    likes: 6,
    likedByMe: false,
    visibility: "gym",
    comments: [
      {
        id: "c5",
        author: "Mike T.",
        text: "Sub-4 club!",
        postedAt: "2 days ago",
      },
    ],
  },
  {
    id: "6",
    author: "Jasmin",
    wodTitle: "Today's RSS WOD",
    wodType: "AMRAP",
    score: "11 rounds + 4",
    notes: "Toes-to-bar broke down after round 8.",
    caption: "Good sweat before work.",
    postedAt: "3 days ago",
    likes: 5,
    likedByMe: false,
    visibility: "gym",
    comments: [],
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function entryMatchesQuery(entry: FeedEntry, query: string): boolean {
  const haystack = [
    entry.author,
    entry.wodTitle,
    entry.wodType,
    entry.score,
    entry.notes ?? "",
    entry.caption ?? "",
    ...entry.comments.flatMap((c) => [c.author, c.text]),
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}

export default function WhiteboardScreen() {
  const { colors, styles } = useAppStyles();

  const [entries, setEntries] = useState<FeedEntry[]>(INITIAL_ENTRIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [commentEntry, setCommentEntry] = useState<FeedEntry | null>(null);
  const [newComment, setNewComment] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareWodTitle, setShareWodTitle] = useState("");
  const [shareScore, setShareScore] = useState("");
  const [shareNotes, setShareNotes] = useState("");
  const [shareCaption, setShareCaption] = useState("");

  const filteredEntries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return entries;
    return entries.filter((entry) => entryMatchesQuery(entry, query));
  }, [entries, searchQuery]);

  const toggleLike = (entryId: string) => {
    setEntries((current) =>
      current.map((entry) => {
        if (entry.id !== entryId) return entry;
        const likedByMe = !entry.likedByMe;
        return {
          ...entry,
          likedByMe,
          likes: entry.likes + (likedByMe ? 1 : -1),
        };
      }),
    );
  };

  const addComment = () => {
    const text = newComment.trim();
    if (!text || !commentEntry) return;

    const comment: FeedComment = {
      id: Date.now().toString(),
      author: CURRENT_USER,
      text,
      postedAt: "Just now",
    };

    setEntries((current) =>
      current.map((entry) =>
        entry.id === commentEntry.id
          ? { ...entry, comments: [...entry.comments, comment] }
          : entry,
      ),
    );

    setCommentEntry((current) =>
      current ? { ...current, comments: [...current.comments, comment] } : null,
    );
    setNewComment("");
  };

  const resetShareForm = () => {
    setShareWodTitle("");
    setShareScore("");
    setShareNotes("");
    setShareCaption("");
  };

  const handleShareWorkout = () => {
    const wodTitle = shareWodTitle.trim();
    const score = shareScore.trim();

    if (!wodTitle || !score) {
      alert("Please enter a workout name and score.");
      return;
    }

    const entry: FeedEntry = {
      id: Date.now().toString(),
      author: CURRENT_USER,
      wodTitle,
      wodType: "Custom",
      score,
      notes: shareNotes.trim() || undefined,
      caption: shareCaption.trim() || undefined,
      postedAt: "Just now",
      likes: 0,
      likedByMe: false,
      comments: [],
      visibility: "gym",
    };

    setEntries((current) => [entry, ...current]);
    setShowShareModal(false);
    resetShareForm();
  };

  return (
    <ThemedView style={styles.page}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedText type="subtitle">Whiteboard</ThemedText>
        <ThemedText style={styles.listLabel}>
          Share your WOD results with your gym community.
        </ThemedText>

        <View style={styles.searchBar}>
          <MaterialIcons
            name="search"
            size={Layout.iconSm}
            color={colors.icon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search athletes, WODs, scores, or comments..."
            placeholderTextColor={colors.icon}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery("")} hitSlop={8}>
              <MaterialIcons name="close" size={20} color={colors.icon} />
            </Pressable>
          )}
        </View>

        <Pressable
          style={styles.buttonOutline}
          onPress={() => setShowShareModal(true)}
        >
          <MaterialIcons
            name="add"
            size={Layout.iconSm}
            color={colors.accent}
          />
          <ThemedText style={styles.buttonOutlineText}>
            Share a Workout
          </ThemedText>
        </Pressable>

        <ThemedText type="defaultSemiBold" style={styles.listLabel}>
          {filteredEntries.length} post
          {filteredEntries.length === 1 ? "" : "s"}
        </ThemedText>

        {filteredEntries.length === 0 ? (
          <View style={styles.emptyState}>
            <ThemedText style={styles.emptyStateText}>
              No posts match your search. Try a different keyword.
            </ThemedText>
          </View>
        ) : (
          <View style={styles.listGapSm}>
            {filteredEntries.map((entry) => (
              <FeedEntryCard
                key={entry.id}
                entry={entry}
                onLike={() => toggleLike(entry.id)}
                onComment={() => setCommentEntry(entry)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <Modal
        visible={commentEntry !== null}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setCommentEntry(null);
          setNewComment("");
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.sheet, styles.sheetTall]}>
            <ThemedText type="defaultSemiBold" style={styles.sheetTitle}>
              Comments
            </ThemedText>
            {commentEntry && (
              <ThemedText style={[styles.listLabel, { marginBottom: 12 }]}>
                {commentEntry.author}&apos;s {commentEntry.wodTitle}
              </ThemedText>
            )}

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              style={{ maxHeight: 280 }}
            >
              {commentEntry?.comments.length === 0 ? (
                <ThemedText style={styles.emptyStateText}>
                  No comments yet. Be the first!
                </ThemedText>
              ) : (
                commentEntry?.comments.map((comment) => (
                  <View key={comment.id} style={styles.feedComment}>
                    <ThemedText style={styles.feedCommentAuthor}>
                      {comment.author}{" "}
                      <ThemedText style={styles.feedTimestamp}>
                        · {comment.postedAt}
                      </ThemedText>
                    </ThemedText>
                    <ThemedText style={styles.feedCommentText}>
                      {comment.text}
                    </ThemedText>
                  </View>
                ))
              )}
            </ScrollView>

            <TextInput
              style={styles.feedCommentInput}
              placeholder="Write a comment..."
              placeholderTextColor={colors.icon}
              value={newComment}
              onChangeText={setNewComment}
              multiline
            />

            <Pressable style={styles.buttonPrimary} onPress={addComment}>
              <ThemedText
                lightColor={colors.onAccent}
                darkColor={colors.onAccent}
                style={styles.buttonPrimaryText}
              >
                Post Comment
              </ThemedText>
            </Pressable>

            <Pressable
              style={styles.buttonCancel}
              onPress={() => {
                setCommentEntry(null);
                setNewComment("");
              }}
            >
              <ThemedText style={styles.textMuted}>Close</ThemedText>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showShareModal}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setShowShareModal(false);
          resetShareForm();
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.sheet, styles.sheetTall]}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <ThemedText type="subtitle" style={styles.sheetTitle}>
                Share a Workout
              </ThemedText>
              <ThemedText style={[styles.listLabel, { marginBottom: 16 }]}>
                Post your score and notes to the whiteboard. Privacy and gym
                filters coming soon.
              </ThemedText>

              <ThemedText style={styles.fieldLabel}>Workout</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="e.g. Fran, Back Squat 5x5"
                placeholderTextColor={colors.icon}
                value={shareWodTitle}
                onChangeText={setShareWodTitle}
              />

              <ThemedText style={styles.fieldLabel}>Score</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="e.g. 4:32, 225 lbs, 15 rounds + 3"
                placeholderTextColor={colors.icon}
                value={shareScore}
                onChangeText={setShareScore}
              />

              <ThemedText style={styles.fieldLabel}>
                Notes (optional)
              </ThemedText>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="How it felt, scaling, equipment used..."
                placeholderTextColor={colors.icon}
                value={shareNotes}
                onChangeText={setShareNotes}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />

              <ThemedText style={styles.fieldLabel}>
                Short comment (optional)
              </ThemedText>
              <TextInput
                style={styles.input}
                placeholder="A quick caption for your post"
                placeholderTextColor={colors.icon}
                value={shareCaption}
                onChangeText={setShareCaption}
              />

              <Pressable
                style={styles.buttonPrimary}
                onPress={handleShareWorkout}
              >
                <ThemedText
                  lightColor={colors.onAccent}
                  darkColor={colors.onAccent}
                  style={styles.buttonPrimaryText}
                >
                  Post to Whiteboard
                </ThemedText>
              </Pressable>

              <Pressable
                style={styles.buttonCancel}
                onPress={() => {
                  setShowShareModal(false);
                  resetShareForm();
                }}
              >
                <ThemedText style={styles.textMuted}>Cancel</ThemedText>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

function FeedEntryCard({
  entry,
  onLike,
  onComment,
}: {
  entry: FeedEntry;
  onLike: () => void;
  onComment: () => void;
}) {
  const { colors, styles } = useAppStyles();

  return (
    <View style={styles.card}>
      <View style={styles.feedEntryHeader}>
        <View style={styles.feedAvatar}>
          <Text style={styles.feedAvatarText}>{getInitials(entry.author)}</Text>
        </View>
        <View style={styles.feedAuthorInfo}>
          <ThemedText style={styles.feedAuthorName}>{entry.author}</ThemedText>
          <ThemedText style={styles.feedTimestamp}>{entry.postedAt}</ThemedText>
        </View>
        <View style={styles.feedVisibilityBadge}>
          <ThemedText style={styles.feedVisibilityText}>
            {entry.visibility === "gym" ? "Gym" : "Public"}
          </ThemedText>
        </View>
      </View>

      <View style={styles.feedWodRow}>
        <View style={styles.typeBadge}>
          <ThemedText
            lightColor={colors.onAccent}
            darkColor={colors.onAccent}
            style={styles.typeBadgeText}
          >
            {entry.wodType}
          </ThemedText>
        </View>
        <ThemedText type="defaultSemiBold" style={styles.wodTitle}>
          {entry.wodTitle}
        </ThemedText>
      </View>

      <View style={styles.feedScoreBox}>
        <ThemedText style={styles.feedScoreValue}>{entry.score}</ThemedText>
        <ThemedText style={styles.feedScoreLabel}>Score</ThemedText>
      </View>

      {entry.caption ? (
        <ThemedText style={styles.feedCaption}>
          &ldquo;{entry.caption}&rdquo;
        </ThemedText>
      ) : null}

      {entry.notes ? (
        <ThemedText style={styles.feedNotes}>{entry.notes}</ThemedText>
      ) : null}

      <View style={styles.feedActions}>
        <Pressable
          style={styles.feedActionButton}
          onPress={onLike}
          accessibilityLabel={entry.likedByMe ? "Unlike post" : "Like post"}
        >
          <MaterialIcons
            name={entry.likedByMe ? "favorite" : "favorite-border"}
            size={Layout.iconSm}
            color={entry.likedByMe ? colors.danger : colors.icon}
          />
          <ThemedText
            style={[
              styles.feedActionText,
              entry.likedByMe ? styles.feedActionTextActive : undefined,
            ]}
          >
            {entry.likes}
          </ThemedText>
        </Pressable>

        <Pressable
          style={styles.feedActionButton}
          onPress={onComment}
          accessibilityLabel="View comments"
        >
          <MaterialIcons
            name="chat-bubble-outline"
            size={Layout.iconSm}
            color={colors.icon}
          />
          <ThemedText style={styles.feedActionText}>
            {entry.comments.length}
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );
}
