import { AvironDataProvider } from './AvironDataProvider';
import { DemoProvider } from './DemoProvider';
import { RaspberryPiProvider } from './RaspberryPiProvider';
import { HardwareMode, RaspberryPiConfig } from '../../types';

let currentProvider: AvironDataProvider | null = null;

export class ProviderFactory {
  public static getProvider(
    mode: HardwareMode = 'DEMO',
    piConfig?: RaspberryPiConfig
  ): AvironDataProvider {
    if (currentProvider && currentProvider.getMode() === mode) {
      return currentProvider;
    }

    if (mode === 'LIVE_HARDWARE') {
      const config: RaspberryPiConfig = piConfig || {
        host: '192.168.1.100',
        port: 8080,
        protocol: 'WebSocket',
        autoConnect: true,
      };
      currentProvider = new RaspberryPiProvider(config);
    } else {
      currentProvider = new DemoProvider();
    }

    return currentProvider;
  }
}
