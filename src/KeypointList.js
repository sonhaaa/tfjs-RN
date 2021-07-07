import React from "react";
import { StyleSheet, View } from "react-native";

export function KeypointList({ keypoints = [] }) {
    return (
        <View style={styles.container}>
            {keypoints.map((p, i) => (
                <View
                    key={i}
                    style={{
                        position: "absolute",
                        bottom: p.position.x,
                        left: p.position.y,
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: "blue"
                    }}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        zIndex: 100,
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: "transparent",
        padding: 8,
        borderRadius: 20
    },
});