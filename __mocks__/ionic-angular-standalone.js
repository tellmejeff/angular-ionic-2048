// Mock for @ionic/angular/standalone
function createMockComponent(name) {
  var Component = function() {};
  Component.ɵfac = function() { return new Component(); };
  Component.ɵcmp = {
    type: Component,
    selectors: [[name]],
    standalone: true,
    features: [0],
    decls: 1,
    vars: 0,
    template: function() {},
    dependencies: [],
    encapsulation: 0
  };
  return Component;
}

// Create mock components
var IonApp = createMockComponent('ion-app');
var IonRouterOutlet = createMockComponent('ion-router-outlet');
var IonHeader = createMockComponent('ion-header');
var IonToolbar = createMockComponent('ion-toolbar');
var IonTitle = createMockComponent('ion-title');
var IonContent = createMockComponent('ion-content');
var IonButton = createMockComponent('ion-button');
var IonItem = createMockComponent('ion-item');
var IonLabel = createMockComponent('ion-label');
var IonGrid = createMockComponent('ion-grid');
var IonRow = createMockComponent('ion-row');
var IonCol = createMockComponent('ion-col');

module.exports = {
  IonApp: IonApp,
  IonRouterOutlet: IonRouterOutlet,
  IonHeader: IonHeader,
  IonToolbar: IonToolbar,
  IonTitle: IonTitle,
  IonContent: IonContent,
  IonButton: IonButton,
  IonItem: IonItem,
  IonLabel: IonLabel,
  IonGrid: IonGrid,
  IonRow: IonRow,
  IonCol: IonCol
};
