const DS_OVERTRAVEL = 'overtravel';
const DS_SURFACE_CLEARANCE = 'surface-clearance';
const DS_CORNER_CLEARANCE = 'corner-clearance';

export const valueSettings = {
    [DS_OVERTRAVEL]: {
        type: 'number',
        label: 'Overtravel',
        description: 'The distance the probe will travel past the expected edge of the workpiece, to account for inaccuracies in the starting position or feature dimensions.',
        parameter: 'O',
        icon: 'mdi-unfold-less-vertical',
        value: 2,
        min: 1,
        max: 20,
        step: 0.1,
        unit: 'mm'
    },
    [DS_SURFACE_CLEARANCE]: {
        type: 'number',
        label: 'Surface Clearance',
        description: 'The distance the probe will move inwards towards the expected surface of the workpiece, to account for inaccuracies in the starting position or work holding.',
        parameter: 'T',
        icon: 'mdi-unfold-more-vertical',
        value: 10,
        min: 2,
        max: 50,
        step: 0.1,
        unit: 'mm'
    },
    [DS_CORNER_CLEARANCE]: {
        type: 'number',
        label: 'Corner Clearance',
        description: 'The distance the probe will move inwards from the expected corner of the workpiece, to account for inaccuracies in the starting position or corner radiuses.',
        parameter: 'C',
        icon: 'mdi-unfold-more-horizontal',
        value: 5,
        min: 1,
        max: 50,
        step: 0.1,
        unit: 'mm'
    }
};

// Not used as these need to be
// arrays of strings.
export enum cornerNames {
    "Front Left",
    "Front Right",
    "Back Right",
    "Back Left"
}

export enum surfaceNames {
    "Left",
    "Right",
    "Front",
    "Back",
    "Top"
}

export type ProbeSetting = {
    type: string;
    label: string;
    description: string;
    parameter?: string;
    icon?: string;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    options?: Array<string>;
    condition?: string;
    conditionValue?: boolean;
}

export type ProbeSettingBoolean = {
    type: 'boolean';
    value: boolean;
} & ProbeSetting;

export type ProbeSettingNumber = {
    type: 'number';
    value: number;
} & ProbeSetting;

export type ProbeSettingEnum = {
    type: 'enum';
    value: number;
} & ProbeSetting;

export type ProbeSettingAll = ProbeSettingBoolean | ProbeSettingNumber | ProbeSettingEnum;

export type ProbeSettings = {
    [key: string]: ProbeSettingBoolean | ProbeSettingNumber | ProbeSettingEnum;
}

export function isBooleanSetting(setting: ProbeSetting): setting is ProbeSettingBoolean {
    return setting.type === 'boolean';
}

export function isNumberSetting(setting: ProbeSetting): setting is ProbeSettingNumber {
    return setting.type === 'number';
}

export function isEnumSetting(setting: ProbeSetting): setting is ProbeSettingEnum {
    return setting.type === 'enum';
}

export type ProbeType = {
    name: string;
    icon: string;
    description: string;
    code: number;
    settings: ProbeSettings;
}

export type ProbeTypes = {
    [key:string]: ProbeType;
}

export default {
    bore: <ProbeType> {
        name: 'Bore',
        icon: 'mdi-circle-outline',
        description: 'Finds the center of a circular bore (negative feature) by probing its inner diameter.',
        code: 6500.1,
        // G6500.1 W{var.workOffset} H{var.boreDiameter} O{var.overTravel} J{global.mosMI[0]} K{global.mosMI[1]} L{global.mosMI[2] - var.probingDepth}
        settings: {
            'diameter': {
                type: 'number',
                label: 'Diameter',
                description: 'The approximate diameter of the bore.',
                parameter: 'H',
                icon: 'mdi-diameter-variant',
                value: 10,
                min: 1,
                max: 100,
                step: 0.1,
                unit: 'mm'
            },
            'depth': {
                type: 'number',
                label: 'Depth (from starting position)',
                description: 'How far to move down from the starting position before probing.',
                parameter: 'Z',
                icon: 'mdi-arrow-down-bold-circle',
                value: 0,
                min: 0,
                max: 100,
                step: 0.1,
                unit: 'mm'
            },
            [DS_OVERTRAVEL]: valueSettings[DS_OVERTRAVEL]
        },
    },
    boss: <ProbeType> {
        name: 'Boss',
        icon: 'mdi-circle',
        description: 'Finds the center of a circular boss (positive feature or workpiece) by probing its outer diameter.',
        code: 6501.1,
        settings: {
            'diameter': {
                type: 'number',
                label: 'Diameter',
                description: 'The approximate diameter of the boss.',
                parameter: 'H',
                icon: 'mdi-diameter-variant',
                value: 10,
                min: 1,
                max: 100,
                step: 0.1,
                unit: 'mm'
            },
            'depth': {
                type: 'number',
                label: 'Depth (from starting position)',
                description: 'How far to move down from the starting position before probing.',
                parameter: 'Z',
                icon: 'mdi-arrow-down-bold-circle',
                value: 0,
                min: 0,
                max: 100,
                step: 0.1,
                unit: 'mm'
            },
            [DS_SURFACE_CLEARANCE]: valueSettings[DS_SURFACE_CLEARANCE],
            [DS_OVERTRAVEL]: valueSettings[DS_OVERTRAVEL]
        },
    },
    rectanglePocket: <ProbeType> {
        name: 'Rectangle Pocket',
        icon: 'mdi-rectangle-outline',
        description: 'Finds the center of a rectangular pocket (negative feature) by probing its inner surfaces.',
        code: 6502.1,
        // G6502.1 W{var.workOffset} H{var.pocketWidth} I{var.pocketLength} T{var.surfaceClearance} C{var.cornerClearance} O{var.overtravel} J{global.mosMI[0]} K{global.mosMI[1]} L{global.mosMI[2] - var.probingDepth}
        settings: {
            'width': {
                type: 'number',
                label: 'Width (on X axis)',
                description: 'The approximate width of the pocket (measured parallel to the X axis).',
                parameter: 'H',
                icon: 'mdi-unfold-more-vertical',
                value: 10,
                min: 0,
                max: 300,
                step: 0.1,
                unit: 'mm'
            },
            'length': {
                type: 'number',
                label: 'Length (on Y axis)',
                description: 'The approximate length of the pocket (measured parallel to the Y axis).',
                parameter: 'I',
                icon: 'mdi-unfold-more-horizontal',
                value: 10,
                min: 0,
                max: 300,
                step: 0.1,
                unit: 'mm'
            },
            'depth': {
                type: 'number',
                label: 'Depth (from starting position)',
                description: 'How far to move down from the starting position before probing.',
                parameter: 'Z',
                icon: 'mdi-arrow-down-bold-circle',
                value: 0,
                min: 0,
                max: 100,
                step: 0.1,
                unit: 'mm'
            },
            [DS_SURFACE_CLEARANCE]: valueSettings[DS_SURFACE_CLEARANCE],
            [DS_CORNER_CLEARANCE]: valueSettings[DS_CORNER_CLEARANCE],
            [DS_OVERTRAVEL]: valueSettings[DS_OVERTRAVEL]
        },
    },
    rectangleBlock: <ProbeType> {
        name: 'Rectangle Block',
        icon: 'mdi-rectangle',
        description: 'Finds the center of a rectangular block (positive feature or workpiece) by probing its outer surfaces.',
        code: 6503.1,
        settings: {
            'width': {
                type: 'number',
                label: 'Width (on X axis)',
                description: 'The approximate width of the block (measured parallel to the X axis).',
                parameter: 'H',
                icon: 'mdi-unfold-more-vertical',
                value: 10,
                min: 0,
                max: 300,
                step: 0.1,
                unit: 'mm'
            },
            'length': {
                type: 'number',
                label: 'Length (on Y axis)',
                description: 'The approximate length of the block (measured parallel to the Y axis).',
                parameter: 'I',
                icon: 'mdi-unfold-more-horizontal',
                value: 10,
                min: 0,
                max: 300,
                step: 0.1,
                unit: 'mm'
            },
            'depth': {
                type: 'number',
                label: 'Depth (from starting position)',
                description: 'How far to move down from the starting position before probing.',
                parameter: 'Z',
                icon: 'mdi-arrow-down-bold-circle',
                value: 5,
                min: 0,
                max: 100,
                step: 0.1,
                unit: 'mm'
            },
            [DS_SURFACE_CLEARANCE]: valueSettings[DS_SURFACE_CLEARANCE],
            [DS_CORNER_CLEARANCE]: valueSettings[DS_CORNER_CLEARANCE],
            [DS_OVERTRAVEL]: valueSettings[DS_OVERTRAVEL]
        },
    },
    outsideCorner: <ProbeType> {
        name: 'Outside Corner',
        icon: 'mdi-square-rounded-badge',
        description: 'Finds the corner of a positive feature or workpiece by probing its outer surfaces.',
        code: 6508.1,
        // G6508.1 W{var.workOffset} Q{var.mode} H{var.xSL} I{var.ySL} N{var.cnr} T{var.SurfaceClearance} C{var.cornerClearance} O{var.overtravel} J{global.mosMI[0]} K{global.mosMI[1]} L{global.mosMI[2] - var.probingDepth}
        settings: {
            'quick': {
                type: 'boolean',
                label: 'Quick Mode',
                description: 'If enabled, only a single probe point will be performed on the surfaces forming the corner. Rotation compensation will not be available.',
                parameter: 'Q',
                icon: 'mdi-clock-fast',
                value: false
            },
            'corner': {
                type: 'enum',
                label: 'Corner',
                description: 'The corner of the workpiece.',
                parameter: 'N',
                icon: 'mdi-rounded-corner',
                value: 0,
                options: ['Front Left', 'Front Right', 'Back Right', 'Back Left'],
            },
            'width': {
                type: 'number',
                label: 'Width',
                description: 'The approximate length of the X surface of the corner.',
                parameter: 'H',
                icon: 'mdi-unfold-more-vertical',
                value: 10,
                min: 0,
                max: 300,
                step: 0.1,
                unit: 'mm',
                condition: 'quick',
                conditionValue: false,
            },
            'length': {
                type: 'number',
                label: 'Length',
                description: 'The approximate length of the Y surface of the corner.',
                parameter: 'I',
                icon: 'mdi-unfold-more-horizontal',
                value: 10,
                min: 0,
                max: 300,
                step: 0.1,
                unit: 'mm',
                condition: 'quick',
                conditionValue: false,
            },
            'depth': {
                type: 'number',
                label: 'Depth (from starting position)',
                description: 'How far to move down from the starting position before probing.',
                parameter: 'Z',
                icon: 'mdi-arrow-down-bold-circle',
                value: 0,
                min: 0,
                max: 100,
                step: 0.1,
                unit: 'mm'
            },
            [DS_SURFACE_CLEARANCE]: valueSettings[DS_SURFACE_CLEARANCE],
            [DS_CORNER_CLEARANCE]: valueSettings[DS_CORNER_CLEARANCE],
            [DS_OVERTRAVEL]: valueSettings[DS_OVERTRAVEL]
        },
    },
    viseCorner: <ProbeType> {
        name: 'Vise Corner',
        icon: 'mdi-cube',
        description: 'Finds the top and corner of a positive feature or workpiece by probing its top and outer surfaces.',
        code: 6520.1,
        settings: {
            'quick': {
                type: 'boolean',
                label: 'Quick Mode',
                description: 'If enabled, only a single probe point will be performed on the surfaces forming the corner. Rotation compensation will not be available.',
                icon: 'mdi-clock-fast',
                value: false
            },
            'corner': {
                type: 'enum',
                label: 'Corner',
                description: 'The corner of the workpiece.',
                icon: 'mdi-rounded-corner',
                value: 0,
                options: ['Front Left', 'Front Right', 'Back Right', 'Back Left'],
            },
            'width': {
                type: 'number',
                label: 'Width',
                description: 'The approximate length of the X surface of the corner.',
                icon: 'mdi-unfold-more-vertical',
                value: 10,
                min: 0,
                max: 300,
                step: 0.1,
                unit: 'mm',
                condition: 'quick',
                conditionValue: false,
            },
            'length': {
                type: 'number',
                label: 'Length',
                description: 'The approximate length of the Y surface of the corner.',
                icon: 'mdi-unfold-more-horizontal',
                value: 10,
                min: 0,
                max: 300,
                step: 0.1,
                unit: 'mm',
                condition: 'quick',
                conditionValue: false,
            },
            'depth': {
                type: 'number',
                label: 'Depth (from top surface)',
                description: 'How far to move down from the top surface of the corner before probing the sides.',
                icon: 'mdi-arrow-down-bold-circle',
                value: 2,
                min: 0,
                max: 100,
                step: 0.1,
                unit: 'mm'
            },
            [DS_SURFACE_CLEARANCE]: valueSettings[DS_SURFACE_CLEARANCE],
            [DS_CORNER_CLEARANCE]: valueSettings[DS_CORNER_CLEARANCE],
            [DS_OVERTRAVEL]: valueSettings[DS_OVERTRAVEL]
        },
    },
    singleSurface: <ProbeType> {
        name: 'Single Surface',
        icon: 'mdi-square-opacity',
        description: 'Finds the co-ordinate of a surface at one point.',
        code: 6510.1,
        settings: {
            'surface': {
                type: 'enum',
                label: 'Surface',
                description: 'The surface towards..',
                value: 0,
                options: ['Left', 'Right', 'Front', 'Back', 'Top'],
            },
            'distance': {
                type: 'number',
                label: 'Distance',
                description: 'The approximate distance to move towards the target surface.',
                icon: 'mdi-ruler',
                value: 10,
                min: 1,
                max: 100,
                step: 0.1,
                unit: 'mm'
            },
            [DS_OVERTRAVEL]: valueSettings[DS_OVERTRAVEL]
        },
    }
} as ProbeTypes;