<style scoped>
    .v-data-table >>> .v-data-table__wrapper > table > tbody > tr > td,
    .v-data-table >>> .v-data-table__wrapper > table > tbody > tr > th,
    .v-data-table >>> .v-data-table__wrapper > table > thead > tr > td,
    .v-data-table >>> .v-data-table__wrapper > table > thead > tr > th,
    .v-data-table >>> .v-data-table__wrapper > table > tfoot > tr > td,
    .v-data-table >>> .v-data-table__wrapper > table > tfoot > tr > th {
    padding: 0 4px;
    }
</style>
<template>
    <v-card>
        <v-card-title>Workplace Origins</v-card-title>
        <v-container fluid>
            <v-row>
                <v-col>
                    <v-data-table
                        dense
                        disable-filtering
                        disable-pagination
                        disable-sort
                        hide-default-footer
                        mobile-breakpoint="0"
                        :headers="headers"
                        :items="items"
                        :item-class="workplaceItemClass"
                        item-key="offset"
                        @click:row="selectWorkplace"
                    >

                        <template v-for="(axis, index) in visibleAxes" v-slot:[`item.${axis.letter}`]="{ item }">
                            <mos-axis-input
                                :key="index"
                                :axis="axis"
                                :workplaceOffset="item.offset"
                            >
                            </mos-axis-input>
                        </template>
                        <template v-slot:item.active="{ item }">
                            <v-icon
                                :color="item.offset == currentWorkplace ? 'success' : 'error'"
                                :disabled="uiFrozen"
                            >
                                {{ item.offset == currentWorkplace ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline' }}
                            </v-icon>
                        </template>

                        <template v-slot:item.actions="{ item }">
                            <v-container fluid py-1 pl-0>
                                <v-row>
                                    <v-col cols="6" lg="6">
                                        <v-tooltip top>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-btn
                                                    icon
                                                    v-bind="attrs"
                                                    v-on="on"
                                                    :disabled="uiFrozen || item.offset == currentWorkplace"
                                                    :loading="item.switching"
                                                >
                                                    <v-icon small @click="switchWorkplace(item)">mdi-swap-horizontal</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>Activate workplace {{ item.workplace }}</span>
                                        </v-tooltip>
                                    </v-col>
                                    <v-col cols="6" lg="6">
                                        <v-tooltip top>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-btn
                                                    icon
                                                    v-bind="attrs"
                                                    v-on="on"
                                                    :disabled="uiFrozen"
                                                    :loading="item.clearing"
                                                >
                                                    <v-icon small @click="clearWorkplace(item)">mdi-cancel</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>Reset workplace {{ item.workplace }}</span>
                                        </v-tooltip>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </template>
                    </v-data-table>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>
<script lang="ts">
    import Vue from "vue";
    import { Axis } from "@duet3d/objectmodel";

    import store from "@/store";

    const workplaceToGCode = function(workplace: number): string {
        return 'G' + ((workplace < 6) ? 54 + workplace : 59 + ((workplace % 5) * 0.1)).toString();
    }

    export default Vue.extend({
        props: {},
        computed: {
            currentWorkplace(): number { return store.state.machine.model.move.workplaceNumber; },
		    uiFrozen(): boolean { return store.getters["uiFrozen"]; },
		    allAxesHomed(): boolean { return store.state.machine.model.move.axes.every(axis => axis.visible && axis.homed)},
            visibleAxes(): Array<Axis> {
                return store.state.machine.model.move.axes.filter(axis => axis.visible);
            },
            visibleAxesLetters(): Array<string> {
                return this.visibleAxes.map(axis => axis.letter);
            },
            items(): Array<any> {
                const workplaces = store.state.machine.model.limits?.workplaces ?? 0;
                return Array.from({ length: workplaces }, (_, w) => {
                    const code = workplaceToGCode(w);
                    const workplace: any = {
                        'workplace': `${w+1} (${code})`,
                        'code': code,
                        'loading': false,
                        'offset': w,
                    };
                    store.state.machine.model.move.axes.forEach(axis => {
                        workplace[axis.letter] = axis.workplaceOffsets[w];
                    });
                    return workplace;
                });
            }
        },
        data() {
            return {
                selectedWorkplace: -1,
                headers: [{
                    text: 'Workplace',
                    value: 'workplace',
                    align: 'start',
                }, ...store.state.machine.model.move.axes.map(axis => ({
                    text: axis.letter,
                    value: axis.letter,
                    align: 'center',
                })), {
                    text: '',
                    value: 'actions',
                    align: 'end',
                }],
            }
        },
        methods: {
            workplaceItemClass(item: any) {
                const color = 'green';
                let accent = (item.offset == this.selectedWorkplace) ? 'lighten-1' : '';
                accent = (item.offset == this.currentWorkplace) ? 'darken-2' : accent;
                return `${color} ${accent}`;
            },
            selectWorkplace(item: any) {
                if(this.selectedWorkplace === item.offset) {
                    this.selectedWorkplace = -1;
                } else {
                    this.selectedWorkplace = item.offset;
                }
            },
            async sendCode(code: string) {
                await store.dispatch("machine/sendCode", code);
            },
            async updateItem(item: any, stateName: string, code: string | null = null) {
                this.$set(item, stateName, true);
                await this.sendCode(code ?? item.code);
                this.$set(item, stateName, false);
            },
            async switchWorkplace(item: any) {
                this.updateItem(item, 'switching');
            },
            async clearWorkplace(item: any) {
                const axisStrings = this.visibleAxesLetters.map(axis => axis + "0").join(" ");
                this.updateItem(item, 'clearing', `G10 L2 P${item.offset+1} ${axisStrings}`);
            }
        }
    });
</script>
