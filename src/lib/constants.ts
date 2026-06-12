export interface ContentType {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  buttonColor: string;
}

export interface Subcategory {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  features?: string[];
  color: string;
  buttonColor: string;
  contentTypes: ContentType[];
}

export interface Category {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  features?: string[];
  color: string;
  buttonColor: string;
  subcategories: Subcategory[];
}

export interface Stage {
  id: string;
  name: string;
  title: string;
  description: string;
  icon?: "book" | "target" | "users";
  color?: string;
  buttonColor?: string;
  features?: string[];
  imageUrl?: string;
  categories: Category[];
}

export const STAGES: Record<string, Stage> = {
  primary: {
    id: "primary",
    name: "المرحلة الابتدائية",
    title: "المرحلة الابتدائية",
    description: "اكتشف محتوى التربية البدنية للمرحلة الابتدائية",
    icon: "book",
    color: "bg-white",
    buttonColor: "bg-[#8A1538]",
    imageUrl: "https://i.imgur.com/sJbg6xJ.png",
    features: [
      "المهارات الحركية الأساسية",
      "الألعاب التعليمية الممتعة",
      "التمارين البدنية البسيطة",
      "تنمية الثقة بالنفس",
      "التعاون والعمل الجماعي",
    ],
    categories: [
      {
        id: "early-childhood",
        title: "مرحلة الطفولة المبكرة",
        description: "محتوى تعليمي مخصص للصفوف الأولية من الأول إلى الثالث",
        imageUrl: "https://i.imgur.com/ddVwLrc.png",
        features: [
          "تطوير المهارات الحركية الأساسية",
          "الألعاب التعليمية التفاعلية",
          "أنشطة تنمية الثقة بالنفس",
        ],
        color: "bg-[#8A1538]/10",
        buttonColor: "bg-[#8A1538]",
        subcategories: [
          {
            id: "active-play",
            title: "اللعب النشط",
            description: "مجموعة متنوعة من الأنشطة الحركية والألعاب التفاعلية",
            imageUrl: "https://i.imgur.com/05hZgET.png",
            features: ["ألعاب حركية", "أنشطة تفاعلية", "تمارين نشطة"],
            color: "bg-[#A91D45]/10",
            buttonColor: "bg-[#A91D45]",
            contentTypes: [
              {
                id: "images",
                title: "الصور",
                description: "مكتبة صور تعليمية للحركات والمهارات الأساسية",
                icon: "image",
                color: "bg-[#8A1538]/10",
                buttonColor: "bg-[#8A1538]",
              },
              {
                id: "videos",
                title: "الفيديوهات",
                description: "مقاطع فيديو تعليمية وتدريبية للمهارات الحركية",
                icon: "video",
                color: "bg-[#C9A227]/15",
                buttonColor: "bg-[#C9A227]",
              },
              {
                id: "files",
                title: "الملفات",
                description: "خطط دراسية وأنشطة تعليمية قابلة للتحميل",
                icon: "file",
                color: "bg-[#A91D45]/10",
                buttonColor: "bg-[#A91D45]",
              },
              {
                id: "talented",
                title: "الموهوبين",
                description:
                  "برامج خاصة لاكتشاف ورعاية المواهب الرياضية المبكرة",
                icon: "star",
                color: "bg-[#6E1029]/10",
                buttonColor: "bg-[#6E1029]",
              },
            ],
          },
          {
            id: "body-management",
            title: "إدارة الجسم",
            description: "تمارين متنوعة لتحسين التحكم والتوازن والمرونة",
            imageUrl: "https://i.imgur.com/YA0lyvE.png",
            features: ["توازن", "مرونة", "تحكم"],
            color: "bg-[#C9A227]/10",
            buttonColor: "bg-[#C9A227]",
            contentTypes: [
              {
                id: "images",
                title: "الصور",
                description: "مكتبة صور تعليمية للحركات والمهارات الأساسية",
                icon: "image",
                color: "bg-[#8A1538]/10",
                buttonColor: "bg-[#8A1538]",
              },
              {
                id: "videos",
                title: "الفيديوهات",
                description: "مقاطع فيديو تعليمية وتدريبية للمهارات الحركية",
                icon: "video",
                color: "bg-[#C9A227]/15",
                buttonColor: "bg-[#C9A227]",
              },
              {
                id: "files",
                title: "الملفات",
                description: "خطط دراسية وأنشطة تعليمية قابلة للتحميل",
                icon: "file",
                color: "bg-[#A91D45]/10",
                buttonColor: "bg-[#A91D45]",
              },
              {
                id: "talented",
                title: "الموهوبين",
                description:
                  "برامج خاصة لاكتشاف ورعاية المواهب الرياضية المبكرة",
                icon: "star",
                color: "bg-[#6E1029]/10",
                buttonColor: "bg-[#6E1029]",
              },
            ],
          },
          {
            id: "expressive-movement",
            title: "الحركة التعبيرية",
            description: "أنشطة إبداعية لتطوير المهارات الحركية التعبيرية",
            imageUrl: "https://i.imgur.com/0576Wqf.png",
            features: ["تعبير حركي", "إبداع", "تناسق"],
            color: "bg-[#8A1538]/10",
            buttonColor: "bg-[#8A1538]",
            contentTypes: [
              {
                id: "images",
                title: "الصور",
                description: "مكتبة صور تعليمية للحركات والمهارات الأساسية",
                icon: "image",
                color: "bg-[#8A1538]/10",
                buttonColor: "bg-[#8A1538]",
              },
              {
                id: "videos",
                title: "الفيديوهات",
                description: "مقاطع فيديو تعليمية وتدريبية للمهارات الحركية",
                icon: "video",
                color: "bg-[#C9A227]/15",
                buttonColor: "bg-[#C9A227]",
              },
              {
                id: "files",
                title: "الملفات",
                description: "خطط دراسية وأنشطة تعليمية قابلة للتحميل",
                icon: "file",
                color: "bg-[#A91D45]/10",
                buttonColor: "bg-[#A91D45]",
              },
              {
                id: "talented",
                title: "الموهوبين",
                description:
                  "برامج خاصة لاكتشاف ورعاية المواهب الرياضية المبكرة",
                icon: "star",
                color: "bg-[#6E1029]/10",
                buttonColor: "bg-[#6E1029]",
              },
            ],
          },
        ],
      },
      {
        id: "upper-grades",
        title: "مرحلة الصفوف العليا",
        description: "محتوى تعليمي مخصص للصفوف العليا من الرابع إلى السادس",
        imageUrl: "https://i.imgur.com/yv5Ny0t.png",
        features: [
          "تطوير المهارات الرياضية المتقدمة",
          "المشاركة في المنافسات",
          "تعزيز روح الفريق",
        ],
        color: "bg-[#A91D45]/10",
        buttonColor: "bg-[#C9A227]",
        subcategories: [
          {
            id: "team-sports",
            title: "الألعاب الجماعية",
            description: "تطوير مهارات العمل الجماعي والتنسيق",
            imageUrl: "https://i.imgur.com/acwSG5W.png",
            features: ["كرة القدم", "كرة السلة", "الكرة الطائرة"],
            color: "bg-[#A91D45]/10",
            buttonColor: "bg-[#A91D45]",
            contentTypes: [
              {
                id: "images",
                title: "الصور",
                description: "مكتبة صور تعليمية للحركات والمهارات الأساسية",
                icon: "image",
                color: "bg-[#8A1538]/10",
                buttonColor: "bg-[#8A1538]",
              },
              {
                id: "videos",
                title: "الفيديوهات",
                description: "مقاطع فيديو تعليمية وتدريبية للمهارات الحركية",
                icon: "video",
                color: "bg-[#C9A227]/15",
                buttonColor: "bg-[#C9A227]",
              },
              {
                id: "files",
                title: "الملفات",
                description: "خطط دراسية وأنشطة تعليمية قابلة للتحميل",
                icon: "file",
                color: "bg-[#A91D45]/10",
                buttonColor: "bg-[#A91D45]",
              },
              {
                id: "talented",
                title: "الموهوبين",
                description:
                  "برامج خاصة لاكتشاف ورعاية المواهب الرياضية المبكرة",
                icon: "star",
                color: "bg-[#6E1029]/10",
                buttonColor: "bg-[#6E1029]",
              },
            ],
          },
          {
            id: "individual-sports",
            title: "الألعاب الفردية",
            description: "تنمية المهارات الشخصية والثقة بالنفس",
            imageUrl: "https://i.imgur.com/acwSG5W.png",
            features: ["الجمباز", "ألعاب القوى", "السباحة"],
            color: "bg-[#C9A227]/10",
            buttonColor: "bg-[#C9A227]",
            contentTypes: [
              {
                id: "images",
                title: "الصور",
                description: "مكتبة صور تعليمية للحركات والمهارات الأساسية",
                icon: "image",
                color: "bg-[#8A1538]/10",
                buttonColor: "bg-[#8A1538]",
              },
              {
                id: "videos",
                title: "الفيديوهات",
                description: "مقاطع فيديو تعليمية وتدريبية للمهارات الحركية",
                icon: "video",
                color: "bg-[#C9A227]/15",
                buttonColor: "bg-[#C9A227]",
              },
              {
                id: "files",
                title: "الملفات",
                description: "خطط دراسية وأنشطة تعليمية قابلة للتحميل",
                icon: "file",
                color: "bg-[#A91D45]/10",
                buttonColor: "bg-[#A91D45]",
              },
              {
                id: "talented",
                title: "الموهوبين",
                description:
                  "برامج خاصة لاكتشاف ورعاية المواهب الرياضية المبكرة",
                icon: "star",
                color: "bg-[#6E1029]/10",
                buttonColor: "bg-[#6E1029]",
              },
            ],
          },
        ],
      },
    ],
  },
};
