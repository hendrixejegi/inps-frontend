import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';
import type {
  UnifiedResultsData,
  UnifiedSubjectResult,
} from '@/lib/types/results';

interface ReportCardDocumentProps {
  data: UnifiedResultsData;
}

const colors = {
  border: '#cbd5e1',
  muted: '#f1f5f9',
  text: '#334155',
  accent: '#1e3a5f',
};

const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontFamily: 'Helvetica',
    fontSize: 8,
    lineHeight: 1.15,
    color: colors.text,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  logo: { width: 52, height: 52, marginRight: 10 },
  headerText: { alignItems: 'center' },
  schoolName: { fontSize: 13, fontWeight: 'bold', textAlign: 'center' },
  headerLine: { fontSize: 8, marginTop: 3, textAlign: 'center' },
  table: {
    borderLeftWidth: 0.5,
    borderTopWidth: 0.5,
    borderColor: colors.border,
    width: '100%',
  },
  row: { flexDirection: 'row' },
  cell: {
    borderBottomWidth: 0.5,
    borderRightWidth: 0.5,
    borderColor: colors.border,
    justifyContent: 'center',
    minHeight: 18,
    padding: 3,
    textAlign: 'center',
  },
  labelCell: {
    backgroundColor: colors.muted,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  studentLabel: { width: '15%' },
  studentValue: { width: '18.33%' },
  section: { marginBottom: 7 },
  academicHeader: {
    backgroundColor: colors.muted,
    fontWeight: 'bold',
    minHeight: 28,
  },
  subjectCell: { textAlign: 'left', width: '13%' },
  scoreCell: { width: '6%' },
  totalCell: { fontWeight: 'bold', width: '7%' },
  cumulativeCell: { width: '9%' },
  averageCell: { width: '12%' },
  gradeCell: { fontWeight: 'bold', width: '6%' },
  positionCell: { width: '6%' },
  remarkCell: { textAlign: 'left', width: '17%' },
  summaryLabel: { width: '16%', textAlign: 'left' },
  summaryValue: { width: '9%' },
  remarkLabel: { width: '22%', textAlign: 'left' },
  remarkValue: { width: '53%', textAlign: 'left' },
  ratingsGrid: { flexDirection: 'row', gap: 8 },
  ratingsBlock: { width: '50%' },
  ratingLabel: { width: '45%', textAlign: 'left' },
  ratingCell: { width: '11%' },
  checkbox: { borderColor: '#94a3b8', borderWidth: 0.7, height: 9, width: 9 },
  ratingKey: {
    borderWidth: 0.5,
    borderColor: colors.border,
    marginTop: 7,
    padding: 6,
  },
  ratingKeyTitle: { fontWeight: 'bold', marginBottom: 3 },
  ratingKeyText: { fontSize: 7 },
});

const Cell = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: object;
}) => <Text style={[styles.cell, style]}>{children}</Text>;

const AcademicHeader = () => (
  <View style={styles.row} fixed>
    <Cell style={[styles.academicHeader, styles.subjectCell]}>SUBJECT</Cell>
    <Cell style={[styles.academicHeader, styles.scoreCell]}>TEST1 30</Cell>
    <Cell style={[styles.academicHeader, styles.scoreCell]}>TEST2 30</Cell>
    <Cell style={[styles.academicHeader, styles.scoreCell]}>EXAM 40</Cell>
    <Cell style={[styles.academicHeader, styles.totalCell]}>TOTAL 100</Cell>
    <Cell style={[styles.academicHeader, styles.scoreCell]}>2ND TERM</Cell>
    <Cell style={[styles.academicHeader, styles.scoreCell]}>1ST TERM</Cell>
    <Cell style={[styles.academicHeader, styles.cumulativeCell]}>
      CUMULATIVE 300
    </Cell>
    <Cell style={[styles.academicHeader, styles.averageCell]}>
      AGGREGATE WEIGHTED AVERAGE
    </Cell>
    <Cell style={[styles.academicHeader, styles.gradeCell]}>GRADE</Cell>
    <Cell style={[styles.academicHeader, styles.positionCell]}>POSITION</Cell>
    <Cell style={[styles.academicHeader, styles.remarkCell]}>REMARK</Cell>
  </View>
);

const AcademicRow = ({ result }: { result: UnifiedSubjectResult }) => (
  <View style={styles.row} wrap={false}>
    <Cell style={styles.subjectCell}>
      {result.subject.subjectName || 'N/A'}
    </Cell>
    <Cell style={styles.scoreCell}>{result.scores.ca1.toFixed(0)}</Cell>
    <Cell style={styles.scoreCell}>{result.scores.ca2.toFixed(0)}</Cell>
    <Cell style={styles.scoreCell}>{result.scores.exam.toFixed(0)}</Cell>
    <Cell style={styles.totalCell}>{result.scores.total.toFixed(0)}</Cell>
    <Cell style={styles.scoreCell}>-</Cell>
    <Cell style={styles.scoreCell}>-</Cell>
    <Cell style={styles.cumulativeCell}>
      {result.cumulativeTotal?.toFixed(0) || '-'}
    </Cell>
    <Cell style={styles.averageCell}>
      {result.weightedAverage?.toFixed(1) || '-'}
    </Cell>
    <Cell style={styles.gradeCell}>{result.scores.grade || '-'}</Cell>
    <Cell style={styles.positionCell}>
      {result.position?.toString() || '-'}
    </Cell>
    <Cell style={styles.remarkCell}>{result.subjectTeacherRemark || '-'}</Cell>
  </View>
);

const RatingTable = ({
  title,
  rows,
}: {
  title: string;
  rows: Array<[string, number | undefined]>;
}) => (
  <View style={[styles.table, styles.ratingsBlock]}>
    <View style={styles.row}>
      <Cell style={[styles.academicHeader, styles.ratingLabel]}>{title}</Cell>
      {[5, 4, 3, 2, 1].map((value) => (
        <Cell key={value} style={[styles.academicHeader, styles.ratingCell]}>
          {value}
        </Cell>
      ))}
    </View>
    {rows.map(([label, rating]) => (
      <View style={styles.row} key={label} wrap={false}>
        <Cell style={styles.ratingLabel}>{label}</Cell>
        {[5, 4, 3, 2, 1].map((value) => (
          <View style={[styles.cell, styles.ratingCell]} key={value}>
            {rating === value ? (
              <View
                style={[styles.checkbox, { backgroundColor: colors.accent }]}
              />
            ) : (
              <View style={styles.checkbox} />
            )}
          </View>
        ))}
      </View>
    ))}
  </View>
);

export const ReportCardDocument = ({ data }: ReportCardDocumentProps) => (
  <Document
    title={`Report Card - ${data.student.admissionNumber}`}
    author="International Nursery and Primary School"
    subject="Student Report Sheet"
  >
    <Page size="A4" orientation="portrait" style={styles.page} wrap>
      <View style={styles.header}>
        <Image
          src="https://res.cloudinary.com/dligmvsem/image/upload/v1786435836/logoo_ddwy4c.png"
          style={styles.logo}
        />
        <View style={styles.headerText}>
          <Text style={styles.schoolName}>
            INTERNATIONAL NURSERY AND PRIMARY SCHOOL
          </Text>
          <Text style={styles.headerLine}>
            11/17 Hill view avenue trans Ekulu Enugu
          </Text>
          <Text style={styles.headerLine}>STUDENT REPORT SHEET</Text>
        </View>
      </View>

      <View style={[styles.section, styles.table]}>
        <View style={styles.row}>
          <Cell style={[styles.labelCell, styles.studentLabel]}>NAME</Cell>
          <Cell style={styles.studentValue}>
            {`${data.student.lastName} ${data.student.firstName} ${data.student.middleName || ''}`.trim()}
          </Cell>
          <Cell style={[styles.labelCell, styles.studentLabel]}>
            ADMISSION NUMBER
          </Cell>
          <Cell style={styles.studentValue}>
            {data.student.admissionNumber || 'N/A'}
          </Cell>
          <Cell style={[styles.labelCell, styles.studentLabel]}>GENDER</Cell>
          <Cell style={styles.studentValue}>
            {data.student.gender || 'N/A'}
          </Cell>
        </View>
        <View style={styles.row}>
          <Cell style={[styles.labelCell, styles.studentLabel]}>CLASS</Cell>
          <Cell style={styles.studentValue}>
            {data.student.className || 'N/A'}
          </Cell>
          <Cell style={[styles.labelCell, styles.studentLabel]}>TERM</Cell>
          <Cell style={styles.studentValue}>{data.term || 'N/A'}</Cell>
          <Cell style={[styles.labelCell, styles.studentLabel]}>YEAR</Cell>
          <Cell style={styles.studentValue}>{data.session || 'N/A'}</Cell>
        </View>
        <View style={styles.row}>
          <Cell style={[styles.labelCell, styles.studentLabel]}>AGE</Cell>
          <Cell style={styles.studentValue}>N/A</Cell>
          <Cell style={[styles.labelCell, styles.studentLabel]}>
            CLASS AGE AVERAGE
          </Cell>
          <Cell style={styles.studentValue}>N/A</Cell>
          <Cell style={[styles.labelCell, styles.studentLabel]}>
            NO. IN CLASS
          </Cell>
          <Cell style={styles.studentValue}>N/A</Cell>
        </View>
        <View style={styles.row}>
          <Cell style={[styles.labelCell, styles.studentLabel]}>POSITION</Cell>
          <Cell style={styles.studentValue}>
            {data.summary?.overallPosition?.toString() || 'N/A'}
          </Cell>
          <Cell style={[styles.labelCell, styles.studentLabel]}>
            TIMES SCHOOL OPENED
          </Cell>
          <Cell style={styles.studentValue}>N/A</Cell>
          <Cell style={[styles.labelCell, styles.studentLabel]}>
            % TIMES PRESENT
          </Cell>
          <Cell style={styles.studentValue}>N/A</Cell>
        </View>
      </View>

      {data.results.length > 0 && (
        <View style={[styles.section, styles.table]}>
          <AcademicHeader />
          {data.results.map((result) => (
            <AcademicRow key={result.subject.id} result={result} />
          ))}
        </View>
      )}

      <View style={[styles.section, styles.table]} minPresenceAhead={45}>
        <View style={styles.row}>
          <Cell style={[styles.labelCell, styles.summaryLabel]}>
            SUBJECTS OFFERED
          </Cell>
          <Cell style={styles.summaryValue}>
            {data.summary?.totalSubjects ?? 0}
          </Cell>
          <Cell style={[styles.labelCell, styles.summaryLabel]}>
            MARK OBTAINED
          </Cell>
          <Cell style={styles.summaryValue}>N/A</Cell>
          <Cell style={[styles.labelCell, styles.summaryLabel]}>
            MARK OBTAINABLE
          </Cell>
          <Cell style={styles.summaryValue}>N/A</Cell>
          <Cell style={[styles.labelCell, styles.summaryLabel]}>% OF MARK</Cell>
          <Cell style={styles.summaryValue}>N/A</Cell>
        </View>
        <View style={styles.row}>
          <Cell style={[styles.labelCell, styles.remarkLabel]}>
            CLASS TEACHER'S REMARK
          </Cell>
          <Cell style={styles.remarkValue}>
            {data.remarks?.classTeacherRemark || 'N/A'}
          </Cell>
        </View>
        <View style={styles.row}>
          <Cell style={[styles.labelCell, styles.remarkLabel]}>
            HEAD OF SCHOOL REMARK
          </Cell>
          <Cell style={styles.remarkValue}>
            {data.remarks?.headTeacherRemark || 'N/A'}
          </Cell>
        </View>
        <View style={styles.row}>
          <Cell style={[styles.labelCell, styles.remarkLabel]}>
            NEXT TERM BEGINS
          </Cell>
          <Cell style={styles.remarkValue}>N/A</Cell>
        </View>
      </View>

      <View style={styles.section} minPresenceAhead={55}>
        <Text
          style={{
            fontSize: 9,
            fontWeight: 'bold',
            marginBottom: 4,
            textAlign: 'center',
          }}
        >
          SKILLS &amp; BEHAVIOR
        </Text>
        <View style={styles.ratingsGrid}>
          <RatingTable
            title="SKILLS 1 - 5"
            rows={[
              ['Fluency', data.skillsRatings?.fluency],
              ['Games', data.skillsRatings?.games],
              ['Musical Skills', data.skillsRatings?.musicalSkills],
            ]}
          />
          <RatingTable
            title="BEHAVIOR 1 - 5"
            rows={[
              ['Punctuality', data.behaviorRatings?.punctuality],
              ['Neatness', data.behaviorRatings?.neatness],
              ['Politeness', data.behaviorRatings?.politeness],
              ['Self Control', data.behaviorRatings?.selfControl],
            ]}
          />
        </View>
        <View style={styles.ratingKey} wrap={false}>
          <Text style={styles.ratingKeyTitle}>KEY TO RATINGS</Text>
          <Text style={styles.ratingKeyText}>
            5: Maintains an excellent degree of observable traits
          </Text>
          <Text style={styles.ratingKeyText}>
            4: Maintains high level of observable traits
          </Text>
          <Text style={styles.ratingKeyText}>
            3: Maintains an acceptable level of observable traits
          </Text>
          <Text style={styles.ratingKeyText}>
            2: Shows minimal level for observable traits
          </Text>
          <Text style={styles.ratingKeyText}>
            1: Has no regards for observable traits
          </Text>
        </View>
      </View>
    </Page>
  </Document>
);
