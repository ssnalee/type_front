import { QuillEditor } from "vue3-quill";

interface AddressData {
  zonecode: string;
  roadAddress: string;
  detailAddress: string;
}

// interface Postcode {
//   open: () => void;
// }


declare module "vue" {
  export interface GlobalComponents {
    QuillEditor: typeof QuillEditor;
  }
}
declare global {
  interface Window {
    daum: {
      Postcode: new (options: {
        oncomplete: (data: {
          zonecode: string;
          roadAddress: string;
          detailAddress: string;
        }) => void;
      }) => {
        open: () => void;
      };
    };
  }
}
