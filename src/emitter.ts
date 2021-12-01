import { EventName, Listener, RuleParams } from './types';

export type Emitter = {
  on: (eventName: EventName, listener: Listener) => void;
  emit: (eventName: EventName, ruleParams: RuleParams) => void;
  eventNames: () => EventName[];
};
type Listeners = { [key in EventName]: Listener[] };

const createEmitter = (): Emitter => {
  const listeners: Listeners = Object.create(null);
  return Object.freeze({
    on(eventName, listener) {
      if (eventName in listeners) {
        listeners[eventName].push(listener);
      } else {
        listeners[eventName] = [listener];
      }
    },

    emit: function (eventName, ruleParams) {
      if (eventName in listeners) {
        listeners[eventName].forEach((listener) => listener(ruleParams));
      }
    },

    eventNames() {
      return Object.keys(listeners);
    },
  });
};

export default createEmitter;
