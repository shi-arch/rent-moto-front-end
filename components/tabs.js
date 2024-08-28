import {Tabs, Tab} from "@nextui-org/tabs";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Switch } from "@nextui-org/switch";
import React from "react";

const ProfileTabs = () => {
    const [isVertical, setIsVertical] = React.useState(true);
    return (
        <div className="flex flex-col px-4">
            <Switch className="mb-4" isSelected={isVertical} onValueChange={setIsVertical}>
                Vertical
            </Switch>
            <div className="flex w-full flex-col">
                <Tabs aria-label="Options" isVertical={isVertical}>
                    <Tab key="photos" title="Photos">
                        <Card>
                            <CardBody>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </CardBody>
                        </Card>
                    </Tab>
                    <Tab key="music" title="Music">
                        <Card>
                            <CardBody>
                                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                            </CardBody>
                        </Card>
                    </Tab>
                    <Tab key="videos" title="Videos">
                        <Card>
                            <CardBody>
                                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </CardBody>
                        </Card>
                    </Tab>
                </Tabs>
            </div>
        </div>
    );
}

export default ProfileTabs