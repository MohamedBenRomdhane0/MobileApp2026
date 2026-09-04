import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { getMaterialEmoji } from "@utils/helpers/materialIcon.helper";
import { getMaterialDisplayName } from "@utils/helpers/material.display.helper";
import type { PlanMaterialPriceUI } from "@redux/apis/plans/plansApi.type";
import type { SelectedMaterials } from "@screens/plans/PlansScreen.type";
import { plansStyles as styles } from "@screens/plans/PlansScreen.styles";
import type { getPlansPalette } from "@screens/plans/PlansScreen.styles";

interface Props {
  materials: PlanMaterialPriceUI[];
  selected:  SelectedMaterials;
  onToggle:  (materialId: number) => void;
  palette:   ReturnType<typeof getPlansPalette>;
}

export function MaterialSelectionChips({ materials, selected, onToggle, palette }: Props) {
  const { t } = useTranslation();

  if (materials.length === 0) return null;

  return (
    <View style={styles.materialsRow}>
      {materials.map((m) => {
        const isChecked = !!selected[m.materialId];
        const label     = getMaterialDisplayName(t, m.materialName);
        const emoji     = getMaterialEmoji(m.materialName);

        return (
          <TouchableOpacity
            key={m.materialId}
            activeOpacity={0.85}
            style={[
              styles.materialChip,
              {
                backgroundColor: isChecked ? `${palette.primary}18` : palette.card,
                borderColor:     isChecked ? palette.primary : palette.border,
              },
            ]}
            onPress={() => onToggle(m.materialId)}
          >
            <View
              style={[
                styles.checkbox,
                {
                  backgroundColor: isChecked ? palette.primary : "transparent",
                  borderColor:     isChecked ? palette.primary : palette.border,
                },
              ]}
            >
              {isChecked && <Ionicons name="checkmark" size={10} color="#fff" />}
            </View>

            <Text style={[styles.materialChipText, { color: isChecked ? palette.primary : palette.text }]}>
              {emoji} {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
