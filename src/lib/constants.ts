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

// أنواع المحتوى القياسية (نفسها في كل التصنيفات)
const STD_CONTENT_TYPES: ContentType[] = [
  {
    id: "images",
    title: "الصور",
    description: "مكتبة صور تعليمية للحركات والمهارات",
    icon: "image",
    color: "bg-[#8A1538]/10",
    buttonColor: "bg-[#8A1538]",
  },
  {
    id: "videos",
    title: "الفيديوهات",
    description: "مقاطع فيديو تعليمية وتدريبية للمهارات",
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
    description: "برامج خاصة لاكتشاف ورعاية المواهب الرياضية",
    icon: "star",
    color: "bg-[#6E1029]/10",
    buttonColor: "bg-[#6E1029]",
  },
];

const SPORT_IMG =
  "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop";

const mkSub = (
  id: string,
  title: string,
  description: string,
  features: string[],
): Subcategory => ({
  id,
  title,
  description,
  imageUrl: SPORT_IMG,
  features,
  color: "bg-[#A91D45]/10",
  buttonColor: "bg-[#A91D45]",
  contentTypes: STD_CONTENT_TYPES,
});

const mkCat = (
  id: string,
  title: string,
  description: string,
  features: string[],
  subcategories: Subcategory[],
): Category => ({
  id,
  title,
  description,
  imageUrl: SPORT_IMG,
  features,
  color: "bg-[#8A1538]/10",
  buttonColor: "bg-[#8A1538]",
  subcategories,
});

export const STAGES: Record<string, Stage> = {
  primary: {
    id: "primary",
    name: "المرحلة الابتدائية",
    title: "المرحلة الابتدائية",
    description: "اكتشف محتوى التربية البدنية للمرحلة الابتدائية",
    icon: "book",
    color: "bg-white",
    buttonColor: "bg-[#8A1538]",
    imageUrl: "/primary_stage.png",
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
        imageUrl: "/early_childhood.png",
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
            imageUrl: "/active_play.png",
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
            imageUrl: "/body_management.png",
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
            imageUrl: "/expressive_movement.png",
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
        imageUrl: "/upper_grades.png",
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
            imageUrl: "/team_sports.png",
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
            imageUrl: "/individual_sports.png",
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

  middle: {
    id: "middle",
    name: "المرحلة الإعدادية",
    title: "المرحلة الإعدادية",
    description: "اكتشف محتوى التربية البدنية للمرحلة الإعدادية",
    icon: "target",
    color: "bg-white",
    buttonColor: "bg-[#8A1538]",
    imageUrl: "/preparatory_stage.png",
    features: [
      "تطوير المهارات الرياضية المتقدمة",
      "بناء الشخصية الرياضية",
      "العمل الجماعي والقيادة",
      "الرياضات التنافسية",
      "اللياقة البدنية",
    ],
    categories: [
      mkCat(
        "middle-individual",
        "المهارات الفردية",
        "تنمية المهارات والقدرات الرياضية الفردية",
        ["مهارات حركية", "لياقة بدنية", "تحكم وتوازن"],
        [
          mkSub("athletics", "ألعاب القوى", "الجري والوثب والرمي وألعاب الميدان", ["جري", "وثب", "رمي"]),
          mkSub("gymnastics", "الجمباز", "تمارين المرونة والتوازن والقوة", ["مرونة", "توازن", "قوة"]),
        ],
      ),
      mkCat(
        "middle-team",
        "الألعاب الجماعية",
        "تطوير مهارات العمل الجماعي والتنسيق",
        ["تعاون", "تنسيق", "روح المنافسة"],
        [
          mkSub("football", "كرة القدم", "مهارات وتكتيكات كرة القدم", ["تمرير", "تسديد", "دفاع"]),
          mkSub("basketball", "كرة السلة", "مهارات وتكتيكات كرة السلة", ["تنطيط", "تصويب", "تمرير"]),
        ],
      ),
    ],
  },

  high: {
    id: "high",
    name: "المرحلة الثانوية",
    title: "المرحلة الثانوية",
    description: "اكتشف محتوى التربية البدنية للمرحلة الثانوية",
    icon: "users",
    color: "bg-white",
    buttonColor: "bg-[#8A1538]",
    imageUrl: "/secondary_stage.png",
    features: [
      "الرياضة التنافسية المتقدمة",
      "التحليل الفني والتكتيكي",
      "الإعداد البدني",
      "الصحة واللياقة",
      "القيادة الرياضية",
    ],
    categories: [
      mkCat(
        "high-competitive",
        "الرياضة التنافسية",
        "إعداد الطلاب للمنافسات والبطولات",
        ["تكتيك", "أداء", "منافسة"],
        [
          mkSub("advanced-team", "الألعاب الجماعية المتقدمة", "تكتيكات متقدمة للألعاب الجماعية", ["تكتيك", "تنظيم", "قيادة"]),
          mkSub("advanced-individual", "الرياضات الفردية المتقدمة", "تطوير الأداء الفردي للمنافسات", ["أداء", "تحمّل", "تركيز"]),
        ],
      ),
      mkCat(
        "high-fitness",
        "اللياقة والصحة",
        "بناء لياقة بدنية متكاملة ونمط حياة صحي",
        ["قوة", "تحمّل", "صحة"],
        [
          mkSub("strength", "القوة واللياقة", "تمارين القوة والتحمّل واللياقة العامة", ["قوة", "تحمّل", "مرونة"]),
          mkSub("health", "الصحة والتغذية", "مفاهيم الصحة والتغذية والوقاية", ["تغذية", "وقاية", "صحة"]),
        ],
      ),
    ],
  },
};
