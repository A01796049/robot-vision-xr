export class YoloEngine {
  constructor(){this.ready=false;this.modelUrl=null;}
  async load(modelUrl){this.modelUrl=modelUrl;throw new Error("Incluye un modelo ONNX y ONNX Runtime Web para activar YOLO real.");}
  async detect(){return [];}
}
