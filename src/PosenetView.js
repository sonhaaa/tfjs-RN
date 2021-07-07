import * as posenet from '@tensorflow-models/posenet'
import * as tf from '@tensorflow/tfjs'
import { Camera } from 'expo-camera';
import React, { useState, useEffect } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { CustomTensorCamera } from './CustomTensorCamera';
import { LoadingView } from './LoadingView';
import { KeypointList } from './KeypointList';
import { useTensorFlowCustomModel, useTensorFlowModel } from './useTensorFlow';

export function PosenetView() {
    const model = useTensorFlowModel(posenet);

    // const [positions, setPositions] = useState([])
    const [keypoints, setKeypoints] = useState([])

    if (!model) {
        return <LoadingView>Loading posenet model</LoadingView>;
    }

    return (
        <View
            style={{ flex: 1, backgroundColor: "black", justifyContent: "center" }}
        >
            <View style={{ borderRadius: 20, overflow: "hidden" }}>
                <ModelCamera model={model} setKeypoints={setKeypoints} />
                <KeypointList keypoints={keypoints} />
            </View>
        </View>
    );
}

function ModelCamera({ model, setKeypoints }) {
    const raf = React.useRef(null);
    const size = useWindowDimensions();

    React.useEffect(() => {
        return () => {
            cancelAnimationFrame(raf.current);
        };
    }, []);

    const onReady = React.useCallback(
        (images, updatePreview, gl) => {
            const loop = async () => {
                const nextImageTensor = images.next().value
                const pose = await model.estimateSinglePose(nextImageTensor)

                // console.log(pose)

                setKeypoints(pose.keypoints)
                raf.current = requestAnimationFrame(loop);
            };
            loop();
        },
        [setKeypoints]
    );

    return React.useMemo(
        () => (
            <CustomTensorCamera
                width={size.width}
                style={styles.camera}
                type={Camera.Constants.Type.back}
                onReady={onReady}
                autorender
            />
        ),
        [onReady, size.width]
    );
}

const styles = StyleSheet.create({
    camera: {
        zIndex: 0,
    },
});