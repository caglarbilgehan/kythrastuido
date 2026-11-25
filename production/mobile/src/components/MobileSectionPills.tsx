import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { M3Colors } from '../theme/material3';
import { SongSection } from '../types/studio';

interface MobileSectionPillsProps {
  sections: SongSection[];
  activeSectionId?: string;
  loopedSectionId: string | null;
  onSelectSection: (section: SongSection) => void;
  onToggleLoopSection: (section: SongSection) => void;
}

export const MobileSectionPills: React.FC<MobileSectionPillsProps> = ({
  sections,
  activeSectionId,
  loopedSectionId,
  onSelectSection,
  onToggleLoopSection
}) => {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {sections.map((section) => {
          const isActive = section.id === activeSectionId;
          const isLooped = section.id === loopedSectionId;
          return (
            <View
              key={section.id}
              style={[
                styles.pill,
                isLooped
                  ? styles.pillLooped
                  : isActive
                  ? styles.pillActive
                  : styles.pillDefault
              ]}
            >
              <TouchableOpacity
                onPress={() => onSelectSection(section)}
                style={styles.pillMain}
              >
                <Text
                  style={[
                    styles.pillText,
                    isActive || isLooped ? styles.pillTextSelected : null
                  ]}
                >
                  {section.name} ({section.startBar}–{section.endBar})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onToggleLoopSection(section)}
                style={styles.loopBtn}
              >
                <Text
                  style={[
                    styles.loopIcon,
                    isActive || isLooped ? styles.pillTextSelected : null
                  ]}
                >
                  ⟳
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%'
  },
  scrollContent: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1
  },
  pillDefault: {
    backgroundColor: M3Colors.surfaceLowest,
    borderColor: M3Colors.outlineVariant
  },
  pillActive: {
    backgroundColor: M3Colors.primary,
    borderColor: M3Colors.primary
  },
  pillLooped: {
    backgroundColor: M3Colors.secondary,
    borderColor: M3Colors.secondary
  },
  pillMain: {
    paddingLeft: 12,
    paddingRight: 6,
    paddingVertical: 7
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
    color: M3Colors.onSurface
  },
  pillTextSelected: {
    color: '#FFFFFF'
  },
  loopBtn: {
    paddingHorizontal: 8,
    paddingVertical: 7
  },
  loopIcon: {
    fontSize: 13,
    fontWeight: '700',
    color: M3Colors.onSurfaceVariant
  }
});
