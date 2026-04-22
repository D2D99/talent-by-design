import OrgUsers from "../../components/orgUsers";

const SearchReports = () => {
    return (
        <div className="bg-white border border-[#448CD2] border-opacity-20 shadow-[4px_4px_4px_0px_#448CD21A] sm:p-6 p-4 rounded-[12px] mt-6 min-h-[calc(100vh-162px)]">
            <div className="mb-6">
                <h2 className="md:text-3xl text-2xl font-bold text-gray-800">Search Member Reports</h2>
                <p className="text-sm text-gray-500 mt-1">
                    Search for a team member to view their completed assessment reports.
                </p>
            </div>

            <OrgUsers isEmbedded={true} hideAdmin={false} />
        </div>
    );
};

export default SearchReports;
