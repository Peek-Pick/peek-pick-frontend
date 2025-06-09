import PlatformSettings from "./PlatformSettings";
import ProfileInformation from "./ProfileInformation";
import AuDetailHeaderComponent from "./auDetailHeaderComponent";

function AuDetailComponent() {
    return (
        <div className="flex flex-col">
            <AuDetailHeaderComponent
                backgroundProfile="bg-white/80 dark:bg-gradient-to-br dark:from-white/20 dark:to-transparent"
                avatarImage="/basicImg"
                name="Esthera Jackson"
                email="esthera@simmmple.com"
            />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-[22px] px-4 py-6">
                <PlatformSettings
                    title="Platform Settings"
                    subtitle1="ACCOUNT"
                    subtitle2="APPLICATION"
                />
                <ProfileInformation
                    title="Profile Information"
                    description="Hi, I’m Esthera Jackson, Decisions: If you can’t decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality)."
                    name="Esthera Jackson"
                    mobile="(44) 123 1234 123"
                    email="esthera@simmmple.com"
                    location="United States"
                />
            </div>
        </div>
    );
}

export default AuDetailComponent;
