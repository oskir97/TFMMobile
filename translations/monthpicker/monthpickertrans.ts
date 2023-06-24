type MonthPickerTrans = {
    months: string[];
    weekDays: { name: string; short: string; isWeekend?: boolean }[];
    weekStartingIndex: number;
    nextMonth: string;
    previousMonth: string;
    openMonthSelector: string;
    openYearSelector: string;
    closeMonthSelector: string;
    closeYearSelector: string;
    defaultPlaceholder: string;
    from: string;
    to: string;
    digitSeparator: string;
    yearLetterSkip: number;
    isRtl: boolean;
  };

const monthpickertrans: Record<string, MonthPickerTrans> = {
    es: {
      months: [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre',
      ],
      weekDays: [
        {
          name: 'Domingo',
          short: 'D',
          isWeekend: true,
        },
        {
          name: 'Lunes',
          short: 'L',
        },
        {
          name: 'Martes',
          short: 'M',
        },
        {
          name: 'Miércoles',
          short: 'X',
        },
        {
          name: 'Jueves',
          short: 'J',
        },
        {
          name: 'Viernes',
          short: 'V',
        },
        {
          name: 'Sábado',
          short: 'S',
          isWeekend: true,
        },
      ],
      weekStartingIndex: 0,
      nextMonth: 'Siguiente mes',
      previousMonth: 'Mes anterior',
      openMonthSelector: 'Abrir selector de mes',
      openYearSelector: 'Abrir selector de año',
      closeMonthSelector: 'Cerrar selector de mes',
      closeYearSelector: 'Cerrar selector de año',
      defaultPlaceholder: 'Seleccionar...',
      from: 'desde',
      to: 'hasta',
      digitSeparator: ',',
      yearLetterSkip: 0,
      isRtl: false,
    },
    en: {
      months: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
      weekDays: [
        {
          name: 'Sunday',
          short: 'S',
          isWeekend: true,
        },
        {
          name: 'Monday',
          short: 'M',
        },
        {
          name: 'Tuesday',
          short: 'T',
        },
        {
          name: 'Wednesday',
          short: 'W',
        },
        {
          name: 'Thursday',
          short: 'T',
        },
        {
          name: 'Friday',
          short: 'F',
        },
        {
          name: 'Saturday',
          short: 'S',
          isWeekend: true,
        },
      ],
      weekStartingIndex: 0,
      nextMonth: 'Next Month',
      previousMonth: 'Previous Month',
      openMonthSelector: 'Open Month Selector',
      openYearSelector: 'Open Year Selector',
      closeMonthSelector: 'Close Month Selector',
      closeYearSelector: 'Close Year Selector',
      defaultPlaceholder: 'Select...',
      from: 'from',
      to: 'to',
      digitSeparator: ',',
      yearLetterSkip: 0,
      isRtl: false,
    },
    ca: {
      months: [
        'Gener',
        'Febrer',
        'Març',
        'Abril',
        'Maig',
        'Juny',
        'Juliol',
        'Agost',
        'Setembre',
        'Octubre',
        'Novembre',
        'Desembre',
      ],
      weekDays: [
        {
          name: 'Diumenge',
          short: 'D',
          isWeekend: true,
        },
        {
          name: 'Dilluns',
          short: 'Dl',
        },
        {
          name: 'Dimarts',
          short: 'Dt',
        },
        {
          name: 'Dimecres',
          short: 'Dc',
        },
        {
          name: 'Dijous',
          short: 'Dj',
        },
        {
          name: 'Divendres',
          short: 'Dv',
        },
        {
          name: 'Dissabte',
          short: 'Ds',
          isWeekend: true,
        },
      ],
      weekStartingIndex: 0,
      nextMonth: 'Següent mes',
      previousMonth: 'Mes anterior',
      openMonthSelector: 'Obrir selector de mes',
      openYearSelector: 'Obrir selector d\'any',
      closeMonthSelector: 'Tancar selector de mes',
      closeYearSelector: 'Tancar selector d\'any',
      defaultPlaceholder: 'Seleccionar...',
      from: 'des de',
      to: 'fins',
      digitSeparator: ',',
      yearLetterSkip: 0,
      isRtl: false,
    },
  };

  export default monthpickertrans;