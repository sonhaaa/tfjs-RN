import * as mobilenet from '@tensorflow-models/mobilenet';
import * as tf from '@tensorflow/tfjs'
import { Camera } from 'expo-camera';
import React, { useState, useEffect } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { CustomTensorCamera } from './CustomTensorCamera';
import { LoadingView } from './LoadingView';
import { PredictionList } from './PredictionList';
import { useTensorFlowCustomModel, useTensorFlowModel } from './useTensorFlow';

export function ModelView() {
    // const model = useTensorFlowModel(mobilenet);

    const modelJSON = require('../tf_model/model.json')
    const modelWeights = require('../tf_model/weights.bin')

    const model = useTensorFlowCustomModel(modelJSON, modelWeights)

    const [predictions, setPredictions] = React.useState([]);

    if (!model) {
        return <LoadingView>Loading TensorFlow model</LoadingView>;
    }

    return (
        <View
            style={{ flex: 1, backgroundColor: "black", justifyContent: "center" }}
        >
            <PredictionList predictions={predictions} />
            <View style={{ borderRadius: 20, overflow: "hidden" }}>
                <ModelCamera model={model} setPredictions={setPredictions} />
            </View>
        </View>
    );
}

function ModelCamera({ model, setPredictions }) {
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
                const nextImageTensor = images.next().value;
                const predictions = await model.predict(nextImageTensor.reshape([1, 224, 224, 3])); // 
                console.log(predictions)
                raf.current = requestAnimationFrame(loop);
            };
            loop();
        },
        [setPredictions]
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