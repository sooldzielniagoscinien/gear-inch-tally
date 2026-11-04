import React, { useCallback, useRef, useState } from 'react';
import { Animated, StatusBar, StyleSheet, View } from 'react-native';
import { GameOverScreen } from './src/screens/GameOverScreen';
import { GameScreen } from './src/screens/GameScreen';
import { LoaderScreen } from './src/screens/LoaderScreen';
import { MenuScreen } from './src/screens/MenuScreen';
import { theme } from './src/constants/theme';
import { CompareSummary } from './src/game/compare';

type Screen = 'loader' | 'menu' | 'game' | 'gameover';

export default function App(): React.JSX.Element {
  const [screen, setScreen] = useState<Screen>('loader');
  const [bikeIndex, setBikeIndex] = useState<number>(0);
  const [summary, setSummary] = useState<CompareSummary | null>(null);
  const fade = useRef(new Animated.Value(1)).current;

  const go = useCallback(
    (next: Screen) => {
      Animated.timing(fade, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setScreen(next);
        Animated.timing(fade, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        }).start();
      });
    },
    [fade],
  );

  const handleLoaderDone = useCallback(() => go('menu'), [go]);

  const handlePlay = useCallback(
    (index: number) => {
      setBikeIndex(index);
      go('game');
    },
    [go],
  );

  const handleBack = useCallback(() => go('menu'), [go]);

  const handleGameOver = useCallback(
    (result: CompareSummary) => {
      setSummary(result);
      go('gameover');
    },
    [go],
  );

  const handlePlayAgain = useCallback(() => go('game'), [go]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <Animated.View style={[styles.root, { opacity: fade }]} pointerEvents="box-none">
        {screen === 'loader' ? <LoaderScreen onDone={handleLoaderDone} /> : null}
        {screen === 'menu' ? <MenuScreen onPlay={handlePlay} /> : null}
        {screen === 'game' ? (
          <GameScreen
            bikeIndex={bikeIndex}
            onBack={handleBack}
            onGameOver={handleGameOver}
          />
        ) : null}
        {screen === 'gameover' && summary ? (
          <GameOverScreen
            summary={summary}
            onPlayAgain={handlePlayAgain}
            onMenu={handleBack}
          />
        ) : null}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg.deep,
  },
});
