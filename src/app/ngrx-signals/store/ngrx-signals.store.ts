import { signalStore, withComputed, withHooks } from "@ngrx/signals";
import { NgRxSignalsService } from "./ngrx-signals.service";
import { withBillingEntities } from "./with-entities";

export const NgRxSignalsStore = signalStore(
  { providedIn: 'root' },
  withBillingEntities(NgRxSignalsService),
  withHooks({
    onInit(store) {
      store.load();
    },
  }),
)